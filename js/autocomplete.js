function ac(ac_element, ac_trigger, keywords, min_length) {

    var ac_display = false;
    var ac_pos = 0;
    var ac_mouse_on_list = 1;
    var ac_matched = [];
    var ac_prevent_defaults = false;
    var ac_options_el = "ac_options";
    var ac_options_scrollTop = 0;

    addEventHandler(document, "keydown", ac_process_key);
    addEventHandler(ac_element, "blur", ac_remove_options_el);
    addEventHandler(document, "keypress", ac_keypress);
    addEventHandler(ac_trigger, "click", ac_toggle_all);

    function ac_toggle_all() {
        if (ac_display){
            ac_mouse_on_list = 0;
            ac_remove_options_el();
        } else {
            ac_element.value = '';
            ac_matched = keywords;
            ac_recreate_el();
        }
    }

    function ac_parse(n) {
        var t = ac_element.value.addslashes();
        var plen = ac_element.value.length;
        var tobuild = '';
        var i;

        var re = new RegExp("^" + t, "i");
        var p = n.search(re);

        for (i = 0; i < p; i++) {
            tobuild += n.substr(i, 1);
        }

        tobuild += "<span style='color:green'>";
        for (i = p; i < plen + p; i++) {
            tobuild += n.substr(i, 1);
        }
        tobuild += "</span>";

        for (i = plen + p; i < n.length; i++) {
            tobuild += n.substr(i, 1);
        }
        return tobuild;
    }

    function ac_recreate_el() {
        if (document.getElementById(ac_options_el)) {
            ac_options_scrollTop = document.getElementById(ac_options_el).scrollTop;
            ac_display = false;
            document.body.removeChild(document.getElementById(ac_options_el));
        }
        if (ac_matched.length == 0) {
            ac_display = false;
            return;
        }
        var container = document.createElement('ul');
        container.className = "options";
        container.style.position = 'absolute';
        container.style.top = curTop(ac_element) + ac_element.offsetHeight + "px";
        container.style.left = curLeft(ac_element) + "px";
        container.id = ac_options_el;
        document.body.appendChild(container);
        addEventHandler(container, 'mouseout',ac_ul_unfocus);
        addEventHandler(container, 'mouseover',ac_ul_focus);
        for (var i = 0; i < ac_matched.length; i++) {
            var c = document.createElement('li');
            container.appendChild(c);
            c.innerHTML = ac_parse(ac_matched[i]);
            c.setAttribute('rel', i);
            if (ac_pos == i) c.className = 'selected';
            addEventHandler(c, 'click',ac_mouseclick);
            addEventHandler(c, 'mouseover',ac_ul_highlight);
        }
        container.scrollTop = ac_options_scrollTop;
        ac_display = true;
        if (ac_pos <= 0) ac_pos = 0;
    }


    function ac_go_up() {
        if (!ac_display) return;
        if (ac_pos == 0) return;
        ac_pos--;
        ac_recreate_el();
    }

    function ac_go_down() {
        if (!ac_display) return;
        if (ac_pos == ac_matched.length-1) return;
        ac_pos++;
        ac_recreate_el();
    }

    function ac_mouseclick() {
        if (!ac_display) return;
        ac_mouse_on_list = 0;
        ac_pos = getAttr(this, 'rel');
        ac_on_enter();
    }

    function ac_ul_focus() {
        ac_mouse_on_list = 1;
    }

    function ac_ul_unfocus() {
        ac_mouse_on_list = 0;
    }

    function ac_ul_highlight() {
        ac_mouse_on_list = 1;
        console.log(this, getAttr(this, 'rel'))
        if(getAttr(this, 'rel') != ac_pos){
            ac_pos = getAttr(this, 'rel')
            ac_recreate_el();
        }
    }

    function ac_on_enter() {
        if (!ac_display) return;
        ac_display = false;
        ac_element.value = ac_matched[ac_pos];
        ac_mouse_on_list = 0;
        ac_remove_options_el();
    }

    function ac_remove_options_el() {
        if (ac_mouse_on_list == 0) {
            ac_display = 0;
            if (document.getElementById(ac_options_el)) {
                document.body.removeChild(document.getElementById(ac_options_el));
            }
        }
    }

    function ac_keypress(e) {
        if (ac_prevent_defaults) stopEvent(e);
        return !ac_prevent_defaults;
    }

    function ac_process_key(evt) {
        if (!evt) evt = window.event;
        var key_code = evt.keyCode;
        ac_prevent_defaults = 0;
        switch (key_code) {
            case 38: //up arrow
                ac_go_up();
                ac_prevent_defaults = 1;
                break;
            case 40: //down arrow
                ac_go_down();
                ac_prevent_defaults = 1;
                break;
            case 13: //enter
            case 9: //tab
                if (ac_display) {
                    ac_prevent_defaults = 1;
                    ac_on_enter();
                }
                break;
            default: //all other
                setTimeout(function () {
                    ac_search()
                }, 200);
                break;
        }
    }

    function ac_search() {
        if (ac_element.value == '') {
            ac_mouse_on_list = 0;
            ac_remove_options_el();
            return;
        }

        if (ac_element.value.length < min_length) {
            ac_mouse_on_list = 0;
            ac_remove_options_el();
            return;
        }

        var escaped_value = ac_element.value.addslashes();
        var re = new RegExp("^" + escaped_value, "i");

        ac_matched = [];
        for (var i = 0; i < keywords.length; i++) {
            if (re.test(keywords[i])) {
                ac_matched.push(keywords[i]);
            }
        }

        ac_recreate_el();
    }
}