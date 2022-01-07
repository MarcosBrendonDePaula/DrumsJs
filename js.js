//Keyboar controls
(()=>{
    //Parts controller
    let audio_sources = [0,0,0,0,0,0,0,0,0]

    function load_resource(file,callback) {
        let req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open("GET", file, false);
        req.send(null)
        return req.responseText
    }

    function load_default_sources() {
        let parts = document.querySelectorAll(".drum_part")
        let count = 0
        for(let part of parts) {
            let drum_part_type = part.classList.item(1)
            let img_view       = part.querySelector(".selected_img")
            img_view.src       =  Parts[drum_part_type].default.img_url
            console.log("Loading:",drum_part_type,load_resource(Parts[drum_part_type].default.source))
            let res = JSON.parse(load_resource(Parts[drum_part_type].default.source))
            audio_sources[count] = res
            count+=1
        }
    }

    let selected_part = {

    }

    let enum_parts = {

    }

    for (let Part in Parts) {
        selected_part[Part] = 0
        enum_parts[Part] = []
        for (let option in Parts[Part]) {
            enum_parts[Part].push(option)
        }
    }

    for(let btn of document.querySelectorAll(".up_btn")) {
        btn.addEventListener("click",(event)=>{
            let obj = event.currentTarget.parentElement.parentElement
            let id = obj.getAttribute("data-id")
            let name = obj.classList.item(1)

            let part             = document.querySelector("."+name)
            let img_view         = part.querySelector(".selected_img")
            let part_option      = enum_parts[name][selected_part[name]+1]
            img_view.src         =  Parts[name][part_option].img_url
            let res = JSON.parse(load_resource(Parts[name][part_option].source))
            selected_part[name] += 1
            audio_sources[parseInt(id)] = res
        })
    }

    for(let btn of document.querySelectorAll(".down_btn")) {
        btn.addEventListener("click",(event)=>{
            let obj = event.currentTarget.parentElement.parentElement
            let id = obj.getAttribute("data-id")
            let name = obj.classList.item(1)

            let part             = document.querySelector("."+name)
            let img_view         = part.querySelector(".selected_img")

            let part_option      = enum_parts[name][selected_part[name]-1]
            img_view.src         =  Parts[name][part_option].img_url
            let res = JSON.parse(load_resource(Parts[name][part_option].source))

            selected_part[name] -= 1
            audio_sources[parseInt(id)] = res
        })
    }

    load_default_sources()


    //Key Mapping
    let buttons_map = {}

    function remap_buttons() {
        let parts = document.querySelectorAll(".drum_part")

        let id_count = 0
        for(let part of parts) {
            let key = part.querySelector(".key").textContent
            buttons_map[key.toLowerCase()] = part
            part.setAttribute('data-id',id_count+"")
            id_count+=1
        }
    }

    document.addEventListener("keydown", key_act)
    remap_buttons()

    function key_act(event) {
        let id = parseInt(buttons_map[event.key].getAttribute("data-id"))
        console.log(audio_sources[id].audio)
        let str = audio_sources[id].audio.data;
        new Audio(str).play()
    }


    for(let key_view of document.querySelectorAll(".key_view")) {
        key_view.addEventListener('click',(event)=>{
            let target = event.currentTarget
            let key = target.querySelector(".key")
            let ant_key      = key.textContent.toLowerCase()
            let key_input    = prompt("Change Key "+ key.textContent +" to")
            buttons_map[key_input.toLowerCase()] = buttons_map[key.textContent.toLowerCase()]
            key.textContent = key_input.toUpperCase()
            buttons_map[ant_key] = undefined
        })
    }

    function add_buttons_event() {

    }

    console.log(buttons_map)


})()