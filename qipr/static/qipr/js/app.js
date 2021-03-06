
//this automatically executes
! function () {

    window.Toaster = function () {
        var timeToShow = 500,
            timeToHide = 5000,
            Toaster = function () {
                var self = this;
                this.toast = document.getElementById('toast') || undefined;

                this.show = () => {
                    window.setTimeout(function () {
                        if (self.toast) {
                            self.toast.classList.add('cts-toast--active');
                        }
                    }, timeToShow);
                };

                this.hide = () => {
                    window.setTimeout(function () {
                        if (self.toast) {
                            self.toast.classList.remove('cts-toast--active');
                        }
                    }, timeToHide);
                };

                this.flash = () => {
                    this.show();
                    this.hide();
                };
            };

        return new Toaster();
    }();

    window.Toaster.flash();

//////////////
//end toast
//////////////

    tagboxInputs = document.getElementsByClassName("tagbox__input");

    Array.prototype.forEach.call(tagboxInputs, (node) => {
        node.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                addTag(this);
            }
        });
        node.addEventListener("blur", function(event) {
            event.preventDefault();
            addTag(this);
        });
        node.addEventListener("input", function(event) {
            var invisibleSpace = '\u200B';
            if (event.target.value.includes(invisibleSpace)){
                addTag(this);
            }
            return true;
        });
    });

    getTagboxName = function (node) {
        if (node.parentElement) {
            if (node.hasAttribute('data-name')) {
                return node.getAttribute('data-name');
            } else {
                return getTagboxName(node.parentElement);
            }
        }
    };

    addTag = function(inputNode) {
        var text = inputNode.value.trim(),
            name = getTagboxName(inputNode),
            tagHolderId = 'tag-holder_' + name,
            key;

        if (text) {
            tag = createtag(text);
            addValue(name, text);
            document.getElementById(tagHolderId).appendChild(tag);
            inputNode.value = "";
        }
    };

    createtag = function(text) {
        var container = document.createElement('div'),
            li = document.createElement('li'),
            tagDelete = document.createElement('i'),
            icontext = document.createTextNode('cancel'),
            tagtext = document.createTextNode(text);

        container.appendChild(li);
        container.appendChild(tagDelete);
        li.appendChild(tagtext);
        tagDelete.appendChild(icontext);

        li.classList.add('tag');
        tagDelete.classList.add('tiny');
        tagDelete.classList.add('tag__delete');
        container.classList.add('tag__container');

        tagDelete.addEventListener('click', function(event) {
            event.preventDefault();
            deleteTag(event);
        });

        return container;
    };

    addValue = function (name, val) {
        var hiddenInputNode = document.getElementById('tag-input_' + name),
            values = hiddenInputNode.value.split(';');
        values.push(val);
        hiddenInputNode.value = values.join(';');
    };

    deleteTag = function (event) {
        var removeMe = event.target.parentElement,
            value = event.target.parentElement.children[0].textContent,//the li
            parent = removeMe.parentElement;
        removeValue(getTagboxName(event.target), value);
        parent.removeChild(removeMe);
    };

    removeValue = function (name, val) {
        var hiddenInputNode = document.getElementById('tag-input_' + name),
            values = hiddenInputNode.value.split(';');
        values = values.filter((item) => item !== val);
        hiddenInputNode.value = values.join(';');
    };

    delete_tags = document.getElementsByClassName("tag__delete");

    Array.prototype.forEach.call(delete_tags, (node) => {
        node.addEventListener('click', deleteTag);
    });

    $('.datepicker').pickadate({
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
    });

    $('.modal-trigger').leanModal();

    window.submit_answer = function (questionId, projectId, choiceId) {
        window.$.ajax('/answer_submit/', {
            method: 'POST',
            data: {
                choice_id: choiceId,
                project_id: projectId,
                question_id: questionId,
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            }
        });
    };

    var facetDetailIcons = document.querySelectorAll('i.facet-tag__details');

    Array.prototype.forEach.call(facetDetailIcons, function (node) {
        node.addEventListener('click', function (event) {
            var clicked = event.target,
                siblingDetailList = clicked.parentElement.querySelector('ul.facet-tag__facet-list');
            if (clicked.classList.contains('facet-tag__details--inactive')) {
                clicked.classList.remove('facet-tag__details--inactive');
                siblingDetailList.classList.remove('hidden');
            } else {
                clicked.classList.add('facet-tag__details--inactive');
                siblingDetailList.classList.add('hidden');
            }
        });
    });

    var facets = document.querySelectorAll('.facet-tag__input');

    var descriptors = JSON.parse(document.querySelector('#search-descriptors').textContent);

    function getFacetTagRoot(node) {
        if (node.classList.contains('facet-tag')) {
            return node;
        } else {
            return node.parentElement && getFacetTagRoot(node.parentElement);
        }
    }

    descriptors.forEach(function (item) {
        Array.prototype.forEach.call(facets, function (facet) {
            var filterField = facet.getAttribute('data-filterfield'),
                value = facet.getAttribute('data-value'),
                root = getFacetTagRoot(facet),
                icon,
                facetList;
            if (value === item.v && filterField === item.ff) {
                facet.checked = true;
                icon = root.querySelector('i');
                facetList = root.querySelector('ul');
                icon.classList.remove('facet-tag__details--inactive');
                facetList.classList.remove('hidden');
            }
        });
    });

    Array.prototype.forEach.call(facets, function (node) {
        node.addEventListener('click', function (event) {
            var clicked = event.target,
                descriptors = document.querySelector('#search-descriptors').textContent,
                filterField = clicked.getAttribute('data-filterfield'),
                value = clicked.getAttribute('data-value'),
                data = {ff: filterField, v: value},
                containsDescriptor;
            descriptors = JSON.parse(descriptors);
            containsDescriptor = descriptors.reduce(function(acc, item) {
                return acc || (item.v === value && item.ff === filterField);
            }, false);
            if (containsDescriptor) {
                descriptors = descriptors.filter(function (item) {
                    return (item.v !== value && item.ff !== value);
                });
            } else {
                descriptors.push(data);
            }
            window.location.pathname="search/d=" + JSON.stringify(descriptors);
        });
    });


}();
