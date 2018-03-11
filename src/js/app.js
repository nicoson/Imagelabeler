class NiuArray extends Array {
    constructor(...args) {
        // 调用父类Array的constructor()
        super(...args)
    }
    addContainer (Container) {
        this.Container = Container;
    }
    push (...args) {
        console.log('监听到数组的变化啦！');
        // 调用父类原型push方法
        super.push(...args)
        refreshList(this.Container, DATA);
        return this
    }
    splice (...args) {
        console.log('监听到数组的变化啦！');
        // 调用父类原型push方法
        super.splice(...args)
        refreshList(this.Container, DATA);
        return this
    }
}

let labeltool = null;
let DATA = new NiuArray();  //  2-way binding page data
DATA.addContainer(document.querySelector("#qiniu_tm_contentfiller"));

window.onload = function() {
    let svgContainer = document.querySelector('#qiniu_tm_imgmarker');
    let imgContainer = document.querySelector('#qiniu_tm_img');
    labeltool = new labelTool(svgContainer, imgContainer, DATA);

    //  initial tabs by bootstrap
    $('#qiniu_tm_detail_tab_header a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    document.querySelector('#qiniu_tm_imgselector').addEventListener('change', function(e) {
        imgData = window.URL.createObjectURL(e.target.files[0]);
        document.querySelector('#qiniu_tm_img').src = imgData;
        labeltool.init(imgData);
    });
}



function refreshList(Container, data) {
    let tmp = '';
    data.forEach(function(datum){
        tmp +=  `<div class="card bg-light ${datum.isKey ? 'text-primary border-primary' : 'text-success border-success'} mb-3">
                    <div class="card-header">
                        ${(datum.isKey ? 'Key: ' : 'Value: ') + datum.id}
                        <button type="button" class="close" aria-label="Close">
                            <span aria-hidden="true" class="js-qiniu-tm-tab-remove" data-id="${datum.id || ''}">&times;</span>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">内容</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control js-qiniu-tm-focus" placeholder="content" data-item="standard_name" data-id="${datum.id || ''}" value="${datum.standard_name || ''}" ／>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">权重</label>
                            <div class="col-sm-9">
                                <input type="number" class="form-control js-qiniu-tm-focus" name="quantity" min="1" max="5" data-item="weight" data-id="${datum.id || ''}" value="${datum.weight || 1}" />
                            </div>
                        </div>
                    </div>
                </div>`;
    });
    Container.innerHTML = tmp;

    document.querySelectorAll(".js-qiniu-tm-focus").forEach(ele => ele.addEventListener("focus", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        let className = DATA[ind].node.getAttribute('class') + ' qiniu-tm-selecthover-on';
        DATA[ind].node.setAttribute('class', className);
    }));

    document.querySelectorAll(".js-qiniu-tm-focus").forEach(ele => ele.addEventListener("blur", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        let className = DATA[ind].node.getAttribute('class').replace(' qiniu-tm-selecthover-on', '');
        DATA[ind].node.setAttribute('class', className);
    }));

    document.querySelectorAll(".js-qiniu-tm-focus").forEach(ele => ele.addEventListener("change", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        DATA[ind][e.target.dataset.item] = e.target.value;
    }));

    document.querySelectorAll(".js-qiniu-tm-tab-remove").forEach(ele => ele.addEventListener("click", function(e) {
        let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
        DATA[ind].node.remove();
        DATA.splice(ind, 1);
    }));
}

loadTemplateLabels = function() {
    fetch('/json/data.json').then(e => e.json()).then(function(data) {
        let tmplist = [];
        data.key.forEach(e => tmplist.push({
            position: e.coord,
            standard_name: e.standard_name,
            weight: e.weight,
            isKey: true,
            isTitle: e.isTitle
        }));
        
        data.value.forEach(e => tmplist.push({
            bbox: e.bbox,
            standard_name: e.standard_name,
            weight: e.weight,
            isKey: false,
            isTitle: e.isTitle
        }));
        
        DATA = new NiuArray();
        DATA.push(tmplist);
    });
}

//  binding box status
document.querySelectorAll('#qiniu_tm_detailpanel_toolbox label')[0].addEventListener("click", function(e) {
    document.querySelectorAll('polygon').forEach(e => e.removeEventListener('click', setKeyFun));
    document.querySelectorAll('polygon').forEach(e => e.removeEventListener('click', setValueFun));
});

//  binding key status
document.querySelectorAll('#qiniu_tm_detailpanel_toolbox label')[1].addEventListener("click", function(e) {
    document.querySelectorAll('polygon').forEach(e => e.addEventListener('click', setKeyFun));
});

//  binding value status
document.querySelectorAll('#qiniu_tm_detailpanel_toolbox label')[2].addEventListener("click", function(e) {
    document.querySelectorAll('polygon').forEach(e => e.addEventListener('click', setValueFun));
});

function setKeyFun(e) {
    e.stopPropagation();
    e.preventDefault();
    
    let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
    DATA[ind].isKey = true;
    DATA[ind].node.setAttribute('stroke', '#1E90FF');
    DATA[ind].node.setAttribute('fill', '#1E90FF');
    refreshList(document.querySelector("#qiniu_tm_contentfiller"), DATA);
}

function setValueFun(e) {
    e.stopPropagation();
    e.preventDefault();

    let ind = DATA.findIndex(t => t.id == e.target.dataset.id);
    DATA[ind].isKey = false;
    DATA[ind].node.setAttribute('stroke', '#28a745');
    DATA[ind].node.setAttribute('fill', '#28a745');
    refreshList(document.querySelector("#qiniu_tm_contentfiller"), DATA);
}