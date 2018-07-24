$(function(){
	var jqueryMap = {
		numHtml : '',
		deadlineHtml:'',
		count : 0,
		deadlineCount : 0,
        limitTimeId: 1,
        moneyId:1,
        page :1,
        limit:10,
        url:'http://106.14.198.182:8280',
	};
	globalMap.url = jqueryMap.url;
    String.prototype.trim = function() {
        return  this.replace(/^\s+|\s+$/g, '');
    };
    function GetRequest() {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };
    var Request = new Object();
    Request = GetRequest();
    globalMap.token = Request.token;
    globalMap.userId = Request.userId;
    function getNum(text) {
        var value = text.replace(/[\u4e00-\u9fa5]/g,"");
       return value;
    };
    function getText(text) {
        var value = text.replace(/\d|-/g,"");
        return value;
    };
    //日期
	$.ajax({
       url:jqueryMap.url+'/rongshu/product/paramRange',
        dataType:'json',
        success:function (res) {
          if (res.code === 0){
              var numList = res.range.moneyList,
                  deadline = res.range.timeLimit,
                  adjustBtnLift = $("#adjustBtnLift"),
                  adjustBtnRight = $('#adjustBtnRight'),
                  moneyBigLeft = $('#moneyBigLeft'),
                  moneyBigRight = $('#moneyBigRight'),
                  moneyBigLeft2 = document.querySelector('#moneyBigLeft'),
                  moneyBigRight2 =document.querySelector("#moneyBigRight");
              for(var i = 0, len = numList.length; i < len; i++){
                  var numMoney = getNum(numList[i].desc),
                       unit = getText(numList[i].desc);
                  jqueryMap.numHtml += '<p class="moneyBig colorRed" moneyid="'+numList[i].id+'" ><dfn class="colorRed adjustNumType">'+numMoney+'</dfn><span>'+unit+'</span></p>';
              };
              for(var j = 0, jen = deadline.length; j < jen; j++){
                  var numDate = getNum(deadline[j].time_name),
                      unitDate = getText(deadline[j].time_name);
                  jqueryMap.deadlineHtml += ' <p class="moneyBig colorRed" limitid="'+deadline[j].id+'"><dfn class="colorRed">'+numDate+'</dfn>'+unitDate+'</p>';
              }
              moneyBigLeft.append(jqueryMap.numHtml);
              moneyBigRight.append(jqueryMap.deadlineHtml);
              var money = new Touch($('.adjustNumLeft'),jqueryMap.count,len,moneyBigLeft,moneyBigLeft2);
              money.touchstart();
              money.touchend();
              var expectNum = new Touch($('.ajustNumRight'),jqueryMap.deadlineCount,jen,moneyBigRight,moneyBigRight2);
              expectNum.touchstart();
              expectNum.touchend();

               ajaxData(numList[0].id,deadline[0].id,jqueryMap);
          }
        },
        error:function (res) {

        }
    });

    $('.leave').on('click',function () {
        window.history.go(-1);
    });
    $('.refresh').on('click',function () {
        jqueryMap.page = 1;
        window.location.reload();
    });
    function Touch(dom,count,len,slideDown,slideDom2) {
    	this.dom = dom;
		this.startX = 0;
        this.startY = 0;
        this.moveEndX = 0;
        this.moveEndY = 0;
        this.X = 0;
        this.Y = 0;
        this.count = count;
        this.len = len;
        this.slideDom = slideDown;
        this.slideDom2 = slideDom2;
        this.touchstart =function () {
        	var that = this;
            this.dom.on('touchstart',function (e) {
                e.preventDefault();
                that.startX = e.touches[0].pageX;
                that.startY = e.touches[0].pageY;
            });
        };
        this.touchend = function () {
        	var that = this;
           this.dom.on('touchend',function (e) {
                e.preventDefault();
               that.moveEndX = e.changedTouches[0].pageX;
               that.moveEndY = e.changedTouches[0].pageY;
               that.X = that.moveEndX - that.startX;
               that.Y = that.moveEndY - that.startY;
                if ( Math.abs(that.X) > Math.abs(that.Y) && that.X > 0 ) {
                } else if ( Math.abs(that.X) > Math.abs( that.Y) &&  that.X < 0 ) {
                } else if ( Math.abs( that.Y) > Math.abs( that.X) &&  that.Y > 0) {
                    if(that.count > 0){
                        that.count--;
                    }
                    that.slideDom.children().eq(that.count).siblings().css({opacity:'0.2'});
                    that.slideDom.children().eq(that.count).css({opacity:'1'});
                    that.slideDom2.style.transform = 'translateY('+(-33*that.count)+'px)';
                    that.slideDom2.style.webkitTransform = 'translateY('+(-33*that.count)+'px)';
                    that.slideDom2.style.transition = "all 1s ease 0s";
                    that.slideDom2.style.webkitTransition = "all 1s ease 0s";

                    if (that.dom[0].getAttribute('class') === 'adjustNumLeft'){   //money
                        jqueryMap.moneyId = that.slideDom.children().eq(that.count).attr('moneyid');
                    }else if (that.dom[0].getAttribute('class') === 'ajustNumRight'){   //limit
                        jqueryMap.limitTimeId = that.slideDom.children().eq(that.count).attr('limitid');
                    }
                    console.log( jqueryMap.moneyId,jqueryMap.limitTimeId);
                    jqueryMap.page = 1;
                    ajaxData(jqueryMap.moneyId,jqueryMap.limitTimeId,jqueryMap);

                } else if ( Math.abs(that.Y) > Math.abs(that.X) &&  that.Y < 0 ) {
                    if(that.count < that.len-1){
                        that.count++;
                    }
                    that.slideDom.children().eq(that.count).siblings().css({opacity:'0.2'});
                    that.slideDom.children().eq(that.count).css({opacity:'1'});
                    that.slideDom2.style.transform = 'translateY('+(-33*that.count)+'px)';
                    that.slideDom2.style.webkitTransform = 'translateY('+(-33*that.count)+'px)';
                    that.slideDom2.style.transition = "all 1s ease 0s";
                    that.slideDom2.style.webkitTransition = "all 1s ease 0s";
                    if (that.dom[0].getAttribute('class') === 'adjustNumLeft'){   //money
                        jqueryMap.moneyId = that.slideDom.children().eq(that.count).attr('moneyid');
                    }else if (that.dom[0].getAttribute('class') === 'ajustNumRight'){   //limit
                        jqueryMap.limitTimeId = that.slideDom.children().eq(that.count).attr('limitid');
                    }
                    console.log( jqueryMap.moneyId,jqueryMap.limitTimeId);
                    jqueryMap.page = 1;
                    ajaxData(jqueryMap.moneyId,jqueryMap.limitTimeId,jqueryMap);
                }
                else{
                }
            })
        };

        this.scroll = function () {
                    $.ajax({
                        url:jqueryMap.url+'/rongshu/product/productList',
                        data:{
                            moneyId:1,
                            limitTimeId:1,
                            page:2,
                            limit:10
                        },
                        success:function (res) {
                            console.log(res)
                        }
                    });
                }
    }
    function ajaxData(moneyId,limitTimeId,jqueryMap) {
        console.log(moneyId,limitTimeId,jqueryMap.page,jqueryMap.limit);
        $.ajax({
            url:jqueryMap.url+'/rongshu/product/productList',
            data:{
                moneyId:moneyId,
                limitTimeId:limitTimeId,
                page:jqueryMap.page,
                limit:jqueryMap.limit
            },
            success:function (res) {
                console.log(res);
                var html = '',text = res.page.list,len = text.length;
                if (len > 0){
                    //href="'+text[i].url+'"
                    for (var i = 0; i < len; i++){
                        var proRateType = text[i].proRateType === 0? '日费' : '月费';
                        text[i].url = text[i].url.trim();
                        html += ' <li class="mb" >\n' +
                            '<a onclick=clickLink('+text[i].storeId+','+text[i].id+',"'+text[i].url+'")>'+
                            '                    <div class="XDbodyList-left">\n' +
                            '                        <div class="left-img"><i></i></div>\n' +
                            '                        <div class="left-font">\n' +
                            '                            <p class="left-font-title">'+text[i].name+'</p>\n' +
                            '                            <p class="left-font-hint publicFC">'+text[i].desc+'</p>\n' +
                            '                        </div>\n' +
                            '                    </div>\n' +
                            '                    <div class="XDbodyList-right">\n' +
                            '                        <div class="right-font">\n' +
                            '                            <div class="rateWrap rateHig">\n' +
                            '                                <p class="limitMoney"><span class="numType">'+text[i].limitMax+'</span><span class="myriadType">元</span></p>\n' +
                            '                                <p class="publicFC">最高额度</p>\n' +
                            '                            </div>\n' +
                            '                            <div class="rateWrap">\n' +
                            '                                <p><span class="rateType">'+text[i].rateMin+'%</span></p>\n' +
                            '                                <p class="publicFC">最低'+ proRateType+'</p>\n' +
                            '                            </div>\n' +
                            '                        </div>\n' +
                            '                        <div class="right-img">\n' +
                            '                            <i class="rateBack"></i>\n' +
                            '                        </div>\n' +
                            '                    </div>\n' +
                            '</a>'+
                            '                </li>'
                    }
                    if( jqueryMap.page == 1){
                        $('.XDbodyList').empty();
                    }
                     $('.allLoan').css({marginTop:'150px',backgroundColor:'#F5F5F5'});$('.XDbodyList').append(html);
                }else {
                    if( jqueryMap.page == 1){
                        html += '<li class="mb loanNoData"><i></i><p>暂无产品,敬请期待!</p></li>';
                        $('.XDbodyList').empty().append(html);$('.allLoan').css({marginTop:'0',backgroundColor:'#ffffff'})
                    }

                }


            },error:function (res) {

            }
        });
    }


    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        var docHeight = $('.wrapper').height();  //内容高度
        var windowHeight = $(window).height();  //xdbody高度
        if ( docHeight  <= scrollTop + windowHeight){
            jqueryMap.page ++;
           ajaxData(jqueryMap.moneyId,jqueryMap.limitTimeId,jqueryMap);


        }
    });


});

var globalMap = {};
function clickLink(storeId,id,url) {
    ajaxLink(storeId,id,globalMap.userId,globalMap.token,url)
}
function ajaxLink(storeId,proId,userId,token,url) {
   console.log(storeId,proId,userId,token,url)
    $.ajax({
        url:globalMap.url+'/rongshu/ops/clickLink',
        data:{
            storeId:storeId,
            proId:proId,
            userId:userId,
            token:token
        },
        success:function (res) {
            console.log(res)
            if (res.code === undefined)res = JSON.parse(res);
            if (res.code == 0){
                url = url +'?token='+token+'&proId='+proId+'&storeId='+storeId;
                window.location.href = url;
            }else {  //android 登录
                android.jumpLogin();
            }
        },error:function (res) {
            if (res.code === undefined)res = JSON.parse(res);
            alert(res.msg)
        }
    });
}




