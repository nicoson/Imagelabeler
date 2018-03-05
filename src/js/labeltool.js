class labelTool {
    constructor(svgContainer, imgContainer) {
        this.img = null;
        this.svgContainer = svgContainer;
        this.imgContainer = imgContainer;
        this.stretchRate = 1;

        this.startX = null;
        this.startY = null;
        this.endX = null;
        this.endY = null;
        this.centerX = null;
        this.centerY = null;
        this.radius = null;
        this.count = 0;

        this.step = 1;

        this.createLabelMarkers();
        this.createEvents();
    }

    init(imgURL) {
        this.img = new Image();
        this.img.src = imgURL;
        this.img.onload = function() {
            this.stretchRate = this.img.width / this.imgContainer.offsetWidth;
            console.log(this.stretchRate);
        }.bind(this)
    }

    destroy() {
        this.clickEvent = null;
        this.mouseMoveEvent = null;
    }

    createLabelMarkers() {
        this.currentNode = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        this.currentNode.setAttribute('id', 'tmp_' + this.count);
        this.currentNode.setAttribute('stroke', '#1E90FF');
        this.currentNode.setAttribute('stroke-width', 1);
        this.currentNode.setAttribute('stroke-opacity', 1);
        this.currentNode.setAttribute('fill', '#1E90FF');
        this.currentNode.setAttribute('fill-opacity', 0.2);
        this.currentNode.setAttribute('class', 'pingan-tm-selecthover');
        this.svgContainer.appendChild(this.currentNode);
        
        this.cycleEle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.cycleEle.setAttribute('stroke', 'grey');
        this.cycleEle.setAttribute('stroke-width', 1);
        this.cycleEle.setAttribute('stroke-opacity', 0.8);
        this.cycleEle.setAttribute('fill', 'grey');
        this.cycleEle.setAttribute('fill-opacity', 0.2);
        this.cycleEle.setAttribute('class', 'pingan-tm-selecthover');
        this.svgContainer.appendChild(this.cycleEle);
    }

    createEvents() {
        this.clickEvent = this.svgContainer.addEventListener('click', function(e) {
            switch(this.step) {
                case 1:
                    this.startX = e.offsetX;
                    this.startY = e.offsetY;
                    this.step = 2;
                    break;
                case 2:
                    this.step = 3;
                    break;
                case 3:
                    this.count++;
                    this.step = 1;
                    this.cycleEle.setAttribute("r", 0);
                    this.createLabelMarkers();
                    break;
                default:
                    break;
            }
        }.bind(this));

        this.mouseMoveEvent = this.svgContainer.addEventListener('mousemove', function(e){
            if(this.step === 2) {
                this.endX = e.offsetX;
                this.endY = e.offsetY;

                this.radius = Math.sqrt((this.startX - this.endX)**2 + (this.startY - this.endY)**2) / 2;
                this.centerX = (this.startX + this.endX) / 2;
                this.centerY = (this.startY + this.endY) / 2;
                
                this.cycleEle.setAttribute('cx', this.centerX);
                this.cycleEle.setAttribute('cy', this.centerY);
                this.cycleEle.setAttribute('r', this.radius);
                
                let points = `${this.startX},${this.startY} ${this.endX},${this.startY} 
                            ${this.endX},${this.endY} ${this.startX},${this.endY}`;
                this.currentNode.setAttribute('points', points);
            } else if (this.step === 3) {
                // <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1"/>
                let x = e.offsetX;
                let y = e.offsetY;
                let maxX = Math.max(this.startX, this.endX);
                let minX = Math.min(this.startX, this.endX);
                x = (x > (this.centerX + this.radius)) ? maxX : ((x < (this.centerX - this.radius)) ? minX : x);

                let y1 = this.centerY + Math.sqrt(this.radius**2 - (x - this.centerX)**2);
                let y2 = this.centerY - Math.sqrt(this.radius**2 - (x - this.centerX)**2);

                let midX = x;
                let midY = (Math.abs(y1 - y) > Math.abs(y2 - y)) ? y2 : y1;

                let midX2 = this.endX - (midX - this.startX);
                let midY2 = this.endY - (midY - this.startY);

                let points = `${this.startX},${this.startY} ${midX},${midY} ${this.endX},${this.endY} ${midX2},${midY2}`;

                this.currentNode.setAttribute('points', points);
            }
        }.bind(this));
    }
}
        
        
        

        

        