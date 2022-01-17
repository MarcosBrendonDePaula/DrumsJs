lowLag.init();
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
            if(Parts[drum_part_type]) {
                img_view.src       =  Parts[drum_part_type].default.img_url
                //console.log("Loading:",drum_part_type,load_resource(Parts[drum_part_type].default.source))
                let res = JSON.parse(load_resource(Parts[drum_part_type].default.source))
                audio_sources[count] = res
                if(res.audio) {
                    lowLag.load([res.audio.data],drum_part_type);
                    count+=1
                }
            }
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

            lowLag.load([res.audio.data],name);
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
            lowLag.load([res.audio.data],name);
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
        lowLag.play(buttons_map[event.key].classList.item(1))
    }


    for(let key_view of document.querySelectorAll(".key_view")) {
        key_view.addEventListener('click',(event)=>{
            let target = event.currentTarget
            let key = target.querySelector(".key")
            let ant_key      = key.textContent.toLowerCase()
            let key_input    = prompt("Change Key "+ key.textContent +" to")

            if(key_input.toLowerCase() == ant_key)
                return

            if(buttons_map[key_input.toLowerCase()]) {
                while(buttons_map[key_input.toLowerCase()])
                    key_input    = prompt("Key in use insert another")
            }

            buttons_map[key_input.toLowerCase()] = buttons_map[key.textContent.toLowerCase()]
            key.textContent = key_input.toUpperCase()
            delete buttons_map[ant_key]
        })
    }
})();

//Menu Controller
(()=>{
    const menu_btn         = document.querySelector(".open_menu_btn")
    const menu_view        = document.querySelector(".menu")

    const metronome_view   = document.querySelector(".metronome_view")
    const metronome_switch = document.querySelector(".metronome_switch")

    const feedback_switch  = document.querySelector(".feedback_switch")
    const feedback_view    = document.querySelector(".feedback_view")


    feedback_switch.addEventListener("click",()=>{
        feedback_view.classList.toggle("d_none")
    })

    metronome_switch.addEventListener("click",()=>{
        metronome_view.classList.toggle("d_none")
    })

    menu_btn.addEventListener("click",()=>{
        menu_view.classList.toggle("menu_expanded")
        menu_btn.classList.toggle("down_btn")
    })

})();

//Metronome Controller
(()=>{

    const metronome_view = document.querySelector(".metronome_view")
    const close_btn      = document.querySelector(".close_btn")

    const metronome_start_btn = document.querySelector("#metronome_start")
    const metronome_stop_btn  = document.querySelector("#metronome_stop")

    const bpm_input           = document.querySelector(".bpm_input")

    close_btn.addEventListener("click",()=>{
        metronome_view.classList.toggle("d_none")
    })

    metronome_start_btn.addEventListener("click",()=>{

        if (Vars.playing)
            return

        Vars.playing = true
        setTimeout(loop,(60000/Vars.bpm))
    })

    metronome_stop_btn.addEventListener("click",()=>{
        Vars.playing = false
    })

    bpm_input.addEventListener("change",()=>{
        Vars.bpm = parseInt(bpm_input.value)
    })

    lowLag.load("sources/metronome_sound.wav","metronome_sound");



    const Vars = {
        playing : false,
        bpm     : 60,
        volume  : 0,
        lastTick: 0,
        proxTick: 0,
        delay   : 0
    }

    const loop = ()=>{
        if(!Vars.playing) {
            return
        }
        let actual_time_tick = new Date().getMilliseconds()
        Vars.delay = Vars.proxTick - actual_time_tick
        lowLag.play("metronome_sound")
        Vars.proxTick = actual_time_tick+(60000/Vars.bpm)
        Vars.lastTick = actual_time_tick

        setTimeout(loop,(60000/Vars.bpm))
        console.log(Vars.delay)
    }
    //setTimeout(loop,60000/Vars.bpm)

})()