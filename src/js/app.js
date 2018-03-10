class Pingan_Radio {
    constructor(parentEle) {
        this.labels = parentEle.querySelectorAll("label");
        this.ele = parentEle.querySelectorAll("input");
        this.addEvent();
    }

    addEvent() {
        this.ele.forEach(e => e.addEventListener('change', function(e){
            this.labels.forEach(e => e.setAttribute('class', 'pingan-btn'));
            e.target.parentElement.setAttribute('class', 'pingan-btn pingan-btn-select');
            console.log('hei');
        }.bind(this)));
    }
}