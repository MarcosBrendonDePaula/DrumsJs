const BetterSleep = ()=>{

    this.tpm = undefined
    this.control = {}
    this.control.pt = undefined
    this.control.lt = undefined
    this.control.step = undefined
    this.control.started = undefined
    this.control.animation_frame = undefined
    this.control.events = {}
    this.control.events_id = 0
    this.control.events_remove = []

    this.start = this.ReqInitMsg;

    this.stop = this.ReqInitMsg;

    this.sleep = this.ReqInitMsg;
    this.wakeUp= this.ReqInitMsg
    this.cancel_sleep = this.ReqInitMsg;

    this.ReqInitMsg = ()=>{
        console.log("required initialization")
    }

    this.init = (tpm = 60)=>{

        this.start = this._start_loop_;
        this.stop  = this._stop_loop_;
        this.sleep = this._add_sleep_;
        this.cancel_sleep = this._remove_sleep_;
        this.wakeUp= this._wake_up_;


        this.control.step = 6000/tpm;
        this.control.pt   = 0;
        this.control.lt   = 0;
        this.control.started = false;

    }

    this._add_sleep_    = (callback= ()=>{} ,time = 60000,args = {})=>{
        let id = this.control.events_id
        this.control.events[id]={
            callback,
            time,
            args
        }
        this.control.events_id += 1
        return id
    }

    this._remove_sleep_ = (id = undefined) => {
        if(id) {
            this.control.events_remove.push(id)
        }
    }

    this._wake_up_     = (id = undefined) => {
        if(id) {
            this.control.events[id].time = -1
        }
    }

    this._start_loop_ = ()=>{
        if(this.control.started)
            return
        this.control.started = true
        this.control.animation_frame = window.requestAnimationFrame(this._main_loop_)
    }

    this._stop_loop_ = ()=>{
        if(!this.control.started)
            return
        window.cancelAnimationFrame(this.control.animation_frame);
    }

    this._main_loop_ = (timestamp)=>{
        this.animation_frame = window.requestAnimationFrame(this._main_loop_)

        for(let ev of this.control.events_remove) {
            delete this.control.events[ev]
        }
        this.control.events_remove = []

        if(timestamp >= this.control.pt){

            let delay       = (timestamp - this.control.pt)
            this.control.pt = (timestamp + this.control.step) - delay
            let delta_T       = timestamp  - this.control.lt;
            this.control.lt = timestamp

            for(let i in this.control.events) {
                let ev = this.control.events[i]
                ev.time -= delta_T
                this.control.events[i] = ev;

                if(ev.time <= 0){
                    ev.callback(ev.args)
                    this.control.events_remove.push(i)
                }
            }
        }
    }
    return this
}

/*
   let bs = BetterSleep();
    g_debug = bs
    bs.init(8000);
    bs.start();
    let bpms = 60000/125
    function tick(){
        lowLag.play(Vars.sound_times[0])
        bs.sleep(tick,bpms)
    }

    bs.sleep(tick,bpms)
 */