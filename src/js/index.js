
$(function(){
    var jqueryMap = {
        xdMap : '.XDmap',
        cityList:'.cityList-wrap',
        chinaTown:'.chinaTown',
        chinaText:'.chinaText',
        typeBodyList:'.typeBodyList',
        XDBannerImg:'.XDBanner-img',
        XDBannerBar:'.XDBanner-bar',
        initialHTML :'',
        initialList:'',
        url:'http://106.14.198.182:8280',
        locationSearch:location.search,
        homePage:1
    };
    String.prototype.trim = function() {
        return  this.replace(/^\s+|\s+$/g, '');
    };
    globalMap.url = jqueryMap.url;
    function GetRequest() {
        var url = jqueryMap.locationSearch;
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
    // Request.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJuYW1lIjoi5Y-26YeR56qXIiwiZXhwIjoxNTEyOTU2MTk2LCJ1c2VyaWQiOiI4MDA0OSJ9.ywEKSzb3ErvgbbIzqGIExLG_9BhQ-if5CDMz2tLL7PajiuJL7thNmyNtPFSE7_lu';
    // Request.userId = '231';
    globalMap.token = Request.token;
    globalMap.userId = Request.userId;
    if (typeof(Storage) !== 'undefined') localStorage.token = globalMap.token ;localStorage.userId = globalMap.userId;
    $('.site-wrapper').on('click',function () {
       jqueryMap.initialHTML ='<div class="chinaLetter"></div>';
     $.getJSON('src/ChinaCity.json',null,function (data) {
         $(data).each(function (index,city) {
             var cityHtml ='', count = index, initialList = '';
             cityHtml +=  '<li class="chinaTown" id ='+"chinaTown"+index+'>'+
                 '<div class="chinaText" id ='+"chinaText"+index+' >'+
                     '<div class="pr23">'+
                         '<div class="chinaInitial"><span>'+city.initial+'</span></div>'+  //字母
                     '</div>'+
                 '</div>';
                 '</li>';
                 //
             initialList += '<div class="initial"><a  class="toggleCity" href='+"#chinaTown"+index+'>'+city.initial+'</a></div>';
             $(jqueryMap.cityList).append(cityHtml);
             if(index === 0){
                 $('.cityList-wrap li:first-child').append(jqueryMap.initialHTML);
             }
             $('.cityList-wrap li:first-child .chinaLetter').append(initialList);
             $(city.list).each(function (index,town) {
                 var childH = '';
                   childH += '<div class="townList"><span>'+town.name+'</span></div>';
                 $('#chinaText'+count+"").append(childH);
             });
         });
         $('.toggleCity').on('click',function () {
              var that = this;
              $('.hintInitial').css({background:'rgba(145,145,145,0.6)',fontSize:'30px',display:'block'}).text(that.innerHTML).fadeIn(500,function () {
                  $(this).fadeOut(100);
              });
              console.log(that.innerHTML)
         })
     });
       $(jqueryMap.xdMap).fadeIn('slow');
       $(".chinaLetter").show();

   });

    $('.toggleCity').on('click',function () {
        alert('1')
    });
  $('.cityLeave').on('click',function () {
      $(jqueryMap.xdMap).fadeOut(100);
      $(".chinaLetter").hide();
      $(jqueryMap.cityList).empty();
  });
  /*tab*/
  $.ajax({
      url:jqueryMap.url+'/rongshu/home/typeJson',
      dataType:'json',
      success:function (res) {
          if (res.code === 0){
              var html = '',text = res.typeList;
              for (var i = 0, len = text.length; i < len; i++){
                  html += '<li><a onclick=XJDLoan('+text[i].id+',"'+text[i].typeName+'") ></a><span>'+text[i].typeName+'</span></li>';
              }
              $('.tab-list').prepend(html);
          }
      },error:function (res) {

      }
  });
  /*首页轮播图*/
    $.ajax({
        url:jqueryMap.url+'/rongshu/home/bannerJson',
        dataType:'json',
        success:function (res) {
            if (res.code === 0){
                console.log(res);
                var html = '',bannerList = res.bannerList,bar = '';jqueryMap.bannerList = bannerList.length;
                if(bannerList.length != 0){
                    //href="'+bannerList[i].url+'"
                    for (var i = 0, len = bannerList.length; i < len; i++){
                        globalUrl[i] = bannerList[i].url;
                        html += '<li><a  href="javascript:void (0)" onclick=linkHome("'+bannerList[i].url+'") style="display: block" ><img src="'+bannerList[i].imgUrl+'" alt=""/></a></li>';
                        bar += '<li></li>';
                    }
                    html += '<li><a style="display: block" href="'+bannerList[0].url+'"><img src="'+bannerList[0].imgUrl+'" alt=""/></a></li>';
                    $(jqueryMap.XDBannerImg).append(html);
                    $(jqueryMap.XDBannerBar).append(bar);
                    $(jqueryMap.XDBannerBar).css({"marginLeft":-$(jqueryMap.XDBannerBar).width()/2+'px'});
                    var imgBoxSon = $(jqueryMap.XDBannerImg).children(),
                        imgBoxlen = imgBoxSon.length;
                    $(jqueryMap.XDBannerImg).css({width:imgBoxlen*100+'%'});
                    for(var k = 0, ken = imgBoxlen; k < ken; k++){
                        imgBoxSon[k].style.width = 100/ken+'%';
                    };


                        scrollPic();

                }

            }
        },error:function (res) {

        }
    });
  /*首页推荐产品*/
  function homeCompany(page) {
      $.ajax({
          url:jqueryMap.url+'/rongshu/product/productRecommendList',
          dataType:'json',
          data:{
              limit:globalMap.limit,
              page:page
          },
          success:function (res) {
              console.log(res);
              if (res.code === 0){
                  console.log(res);
                  var html = '',text = res.page.list;
                  console.log(text);
                  if (text.length != 0){
                      for (var i = 0, len = text.length; i < len; i++){
                          var proRateType = text[i].proRateType;
                          if (proRateType === 0){
                              proRateType = '日费';
                          }else if (proRateType === 1){
                              proRateType = '月费';
                          }
                          text[i].url = text[i].url.trim();
                          html += ' <li  class="mb">\n' +
                              '               <a onclick=clickLink('+text[i].storeId+','+text[i].id+',"'+text[i].url+'")>'+
                              '                    <div class="XDbodyList-left">\n' +
                              '                        <div class="left-img"><i style="background-image:url('+text[i].imgUrl+')"></i></div>\n' +
                              '                        <div class="left-font">\n' +
                              '                            <p class="left-font-title">'+text[i].name+'</p>\n' +
                              '                            <p class="left-font-hint publicFC">'+text[i].desc+'</p>\n' +
                              '                        </div>\n' +
                              '                    </div>\n' +
                              '                    <div class="XDbodyList-right">\n' +
                              '                        <div class="right-font ">\n' +
                              '                            <div class="rateWrap rateHig">\n' +
                              '                                <p class="limitMoney"><span class="numType">'+text[i].limitMax+'</span><span class="myriadType">元</span></p>\n' +
                              '                                <p class="publicFC">最高额度</p>\n' +
                              '                            </div>\n' +
                              '                            <div class="rateWrap">\n' +
                              '                                <p><span class="rateType">'+text[i].rateMin+'%</span></p>\n' +
                              '                                <p class="publicFC">最低'+proRateType+'</p>\n' +
                              '                            </div>\n' +
                              '                        </div>\n' +
                              '                        <div class="right-img ">\n' +
                              '                            <i class="rateBack"></i>\n' +
                              '                        </div>\n' +
                              '                    </div>\n' +
                              '             </a>'+
                              '         </li>';
                      }
                      $('#homePageList').append(html);
                  }else{
                      if (page == 1){
                          html = '<li><p  class="homeHint">暂无产品,敬请期待!</p></li>';
                          $('#homePageList').empty().append(html);
                          $('.homeHint').css({textAlign:'center',color:"rgb(153,153,153)",fontSize:'12px'});
                      }
                  }

              }
          },error:function (res) {

          }
      });
  }
  homeCompany(jqueryMap.homePage);


    $('.loanLeave').on('click',function (e) {
        e.preventDefault();
        // $('.homePage').fadeIn('slow');
        $('.loanWrap').fadeOut(100);
         // clearInterval(timer);
         // timer = setInterval(self,2000);
        globalMap.page = 1;
    });
    /*各种贷款重置刷新*/
    $('.loanRefresh').on('click',function (e) {
        e.preventDefault();
        globalMap.page = 1;
        $(globalMap.typeBodyList).empty();
        loanAjax(globalMap.id,globalMap.typeBodyList);
    });

    /*申请记录*/
    $('.userApply').on('click',function (e) {
        e.preventDefault();
        applyAjax();
        globalMap.applyJudge = true;
    });

    function applyAjax() {
        $.ajax({
            url:globalMap.url+'/rongshu/ops/helpFlowList',
            data:{
                page:globalMap.applyPage,
                limit:globalMap.limit,
                userId:localStorage.userId,
                token:localStorage.token
            },
            success:function (res) {
                if (res.code === undefined){
                    res = JSON.parse(res);
                }
                console.log(res);
                if (res.code == 0){
                    if (globalMap.applyJudge){
                        $('.applyRecord').fadeIn('slow');
                    }
                    var text = res.page.list, html = '';
                    if (text.length != 0){
                        for (var i = 0, len = text.length; i < len; i++){
                            text[i].proRateType = text[i].proRateType == 0? '日费' : '月费';
                            html += '   <li class="mb">\n' +
                                '                    <div class="applyList">\n' +
                                '                        <div class="applyList-left">\n' +
                                '                            <div class="left-img"><i style="background-image:url('+text[i].proIcon+')"></i></div>\n' +
                                '                            <div class="left-font">\n' +
                                '                                <p class="left-font-title">'+text[i].proName+'</p>\n' +
                                '                              <p> <span class="mt10 publicFC">最低'+text[i].proRateType+'</span><span class="publicFC colorRed">'+text[i].proRateMin+'%</span></p> \n' +
                                '                            </div>\n' +
                                '                        </div>\n' +
                                '                        <div class="applyList-right">\n' +
                                '                            <div class="right-font inBlock">\n' +
                                '                                <div class="inBlock pl11">\n' +
                                '                                    <p><span class="publicFC">'+text[i].opsDate+'</span></p>\n' +
                                '                                    <p class="publicFC colorBlue">已注册</p>\n' +
                                '                                </div>\n' +
                                '                            </div>\n' +
                                '                        </div>\n' +
                                '                        <div>\n' +
                                '\n' +
                                '                        </div>\n' +
                                '                    </div>\n' +
                                '                    <div class="applyHint">\n' +
                                '                        <p>请保持电话联系,并随时关注审核结果!</p>\n' +
                                '                    </div>\n' +
                                '                </li>'
                        }
                        $('.applyBody').css({backgroundColor:'#F5F5F5'});
                        $('.applyListWrap').append(html);
                    }else{
                        html = '<li class="mb loanNoData"><i></i><p style="text-align: center">你尚未有借款记录!</p><button class="applyBtn">去借款</button></li>';
                        if( globalMap.applyPage == 1){
                            $('.applyBody').css({backgroundColor:'#ffffff'});
                            $('.applyListWrap').empty().append(html);
                            $('.applyBtn').on('click',function (e) {
                                e.preventDefault();
                                $('.applyRecord').fadeOut(100);
                            })
                        }


                    }
                }else{
                    android.jumpLogin();
                }

            },error:function (res) {

            }
        })
    }
    $('.applyRecord').scroll(function () {
        var scrollTop = $('.applyRecord').scrollTop();
        var docHeight = $('.applyRecord').height();
        var totalHeight = $('.applyBody').height();
        if (totalHeight+45 <= scrollTop + docHeight && scrollTop != 0){
            globalMap.applyPage ++;
            globalMap.applyJudge = false;
            applyAjax();
        }
    });

    $('#leaveRecord').on('click',function (e) {
        e.preventDefault();
        $('.applyRecord').fadeOut(100);
    });
    $('.applyRefresh').on('click',function (e) {
        globalMap.applyPage = 1;
        e.preventDefault();
        $('.applyListWrap').empty();
        globalMap.applyJudge = false;
        applyAjax();
    })
    $('.homePage').scroll(function(){
        var scrollTop = $('.homePage').scrollTop();
        var docHeight = $('.homePage').height();
        var totalHeight = $('#homePageList').height();
        //378
        if (totalHeight+370 <= scrollTop + docHeight && scrollTop != 0){
            jqueryMap.homePage ++;
            homeCompany(jqueryMap.homePage);
        }
    });





});

var globalMap = {page:1,typeBodyList:'.typeBodyList',tabTitle:'#tabTitle',applyPage:1,limit:10},globalUrl ={};
/*tab 各种贷款请求*/
function loanAjax(id,dom) {
    console.log(globalMap.page);
    $.ajax({
        url:globalMap.url+'/rongshu/product/productListOfType',
        data:{
            typeId:id,
            limit:globalMap.limit,
            page:globalMap.page
        },
        success:function (res) {
            if (res.code === 0){
                var html ='', page = res.page.list, len = page.length;
                console.log(page);
                if (len != 0){
                    //href="'+page[i].url+'"
                    for (var i = 0; i < len; i++){
                        var proRateType = page[i].proRateType;
                        if (proRateType === 0){
                            proRateType = '日费';
                        }else if (proRateType === 1){
                            proRateType = '月费';
                        }
                        page[i].url = page[i].url.trim();
                        html+= ' <li class="mb">\n' +
                            '                        <a class="clickLink" onclick=clickLink('+page[i].storeId+','+page[i].id+',"'+page[i].url+'")>\n' +
                            '                            <div class="XDbodyList-left">\n' +
                            '                                <div class="left-img"><i style="background-image:url('+page[i].imgUrl+')"></i></div>\n' +
                            '                                <div class="left-font">\n' +
                            '                                    <p class="left-font-title">'+page[i].name+'</p>\n' +
                            '                                    <p class="left-font-hint publicFC">'+page[i].desc+'</p>\n' +
                            '                                </div>\n' +
                            '                            </div>\n' +
                            '                            <div class="XDbodyList-right">\n' +
                            '                                <div class="right-font ">\n' +
                            '                                    <div class="rateHig  ">\n' +
                            '                                        <p class="limitMoney"><span class="numType">'+page[i].limitMax+'</span><span class="myriadType">元</span></p>\n' +
                            '                                        <p class="publicFC">最高额度</p>\n' +
                            '                                    </div>\n' +
                            '                                    <div class="rateWrap  ">\n' +
                            '                                        <p><span class="rateType">'+page[i].rateMin+'%</span></p>\n' +
                            '                                        <p class="publicFC">最低'+proRateType+'</p>\n' +
                            '                                    </div>\n' +
                            '                                </div>\n' +
                            '                                <div class="right-img ">\n' +
                            '                                    <i class="rateBack"></i>\n' +
                            '                                </div>\n' +
                            '                            </div>\n' +
                            '                        </a>\n' +
                            '                    </li>'
                    }
                    $(dom).append(html);
                    $('.XDbody').css({backgroundColor:'#F5F5F5'});
                }else{
                    html += '<li class="mb loanNoData"><i></i><p>新产品即将上线,敬请期待!</p></li>';
                    if( globalMap.page == 1){
                        $(dom).empty().append(html);
                        $('.XDbody').css({backgroundColor:'#ffffff'})
                    }

                }

            }
        },error:function (res) {

        }
    });
}
/*tab 各种贷款请求点击*/
function XJDLoan(id,title) {
    $(globalMap.tabTitle).text(title);
    globalMap.id = id;
    globalMap.page = 1;
    var typeBodyList = $('.typeBodyList');
    $('.loanWrap').fadeIn('slow');
    // $('.homePage').fadeOut();
    // clearInterval(globalMap.timer);
     typeBodyList.empty();
    loanAjax(id,typeBodyList);
}

function ajaxLink(storeId,proId,userId,token,url) {
    $.ajax({
        url:globalMap.url+'/rongshu/ops/clickLink',
        data:{
            storeId:storeId,
            proId:proId,
            userId:userId,
            token:token
        },
        success:function (res) {
            if (res.code === undefined){
                res = JSON.parse(res);
            }
            console.log(res);
            if (res.code == 0){
                 //   判断是否登录  ////////////////
                url = url +'?token='+token+'&proId='+proId+'&storeId='+storeId;
                window.location.href = url;
            }else {
                android.jumpLogin();
            }
        },error:function (res) {
            res = JSON.parse(res);
            alert(res.msg)
        }
    });
}
function clickLink(storeId,id,url) {
  console.log(storeId);
    console.log(id);
    console.log(url);
    ajaxLink(storeId,id,localStorage.userId,localStorage.token,url)
}




function Scroll(value,ajaxParam) {
    this.obj = value;
    this.ajaxParam = ajaxParam
}
Scroll.prototype = {
    slide :function () {
        var scrollTop = this.obj.scrDom.scrollTop();
        var docHeight = this.obj.scrDom.height();
        var totalHeight = this.obj.scrContent.height();
        if (totalHeight+this.obj.num <= scrollTop + docHeight && scrollTop != 0){
            this.obj.page ++;
            loanAjax(globalMap.id,globalMap.typeBodyList)
        }
    }
};

$('.loanWrap').scroll(function () {
    var scrollTop = $('.loanWrap').scrollTop();
     // console.log(scrollTop);
    var docHeight = $('.loanWrap').height();
    var totalHeight = $('.typeBodyList').height();
    if (totalHeight+65 <= scrollTop + docHeight && scrollTop != 0){
        globalMap.page ++;
        loanAjax(globalMap.id,globalMap.typeBodyList)
    }
});

function linkHome(a) {
    console.log(a);
    window.location.href = a;
}


var scrollPic = function () {
    var XDBannerBar = document.querySelector(".XDBanner-bar");
     XDBannerBarChild = XDBannerBar.children,
     banner = document.querySelector('.XDBanner'),
     width = banner.offsetWidth,
     index = 0, timer = null, itemNum = 0, touchVal = {judge : true}, timeOut = null, touchTime = null,
     imgBox = banner.getElementsByTagName('ul')[0],
     imgBoxList = document.querySelector('.XDBanner-img'),
     setScrolling = function (index) {
        imgBox.style.transform = 'translateX('+(-index*width) + 'px)';
        imgBox.style.webkitTransform = 'translateX('+(-index*width) + 'px)';
        imgBox.style.transition = "all 1s ease 0s";
        imgBox.style.webkitTransition = "all 1s ease 0s";
    },
     setTransform = function (index) {
        imgBox.style.transform = 'translateX('+(-index*width) + 'px)';
        imgBox.style.webkitTransform = 'translateX('+(-index*width) + 'px)';
    },
     removeTransition = function () {
        imgBox.style.transition = "none";
        imgBox.style.webkitTransition = "none";
    };
    function self() {
        index++;
        setScrolling(index);
    }
   timer = setInterval(self,4000);
    imgBox.addEventListener('transitionEnd', function () {
        for(var i = 0,len = XDBannerBarChild.length; i<len; i++){
            XDBannerBarChild[i].style.background = '#dddddd';
        }
        removeTransition();
        if(index >= len){
            index = 0;
            var sum = 0;
            XDBannerBarChild[sum].style.background = '#ffffff';
        }else{
            XDBannerBarChild[index].style.background = '#ffffff';
        }
        setTransform(index);
    });
    imgBox.addEventListener('webkitTransitionEnd', function () {
        for(var i = 0,len = XDBannerBarChild.length; i<len; i++){
            XDBannerBarChild[i].style.background = '#dddddd';
        }
        removeTransition();
        if(index >= len){
            index = 0;
            var sum = 0;
            XDBannerBarChild[sum].style.background = '#ffffff';
        }else{
            XDBannerBarChild[index].style.background = '#ffffff';
        }
        touchVal.judge = true;
        setTransform(index);
    });

              imgBoxList.addEventListener('touchstart',function (e) {
                  e.preventDefault();
                  console.log('touchstart');
                  touchVal.startX = e.touches[0].pageX;
                  touchVal.startY = e.touches[0].pageY;
                  clearInterval(timer);
                  touchVal.judgeTime = false;
                  clearTimeout(touchTime);
                  // touchTime = null;
              },false);
              imgBoxList.addEventListener('touchend',function (e){
                  e.preventDefault();
               touchVal.moveEndX = e.changedTouches[0].pageX;
               touchVal.moveEndY = e.changedTouches[0].pageY;
                  touchVal.X = touchVal.moveEndX - touchVal.startX;
                  touchVal.Y = touchVal.moveEndY - touchVal.startY;
                  if ( Math.abs(touchVal.X) > Math.abs(touchVal.Y) && touchVal.X > 0 ) {
                      if (touchVal.judge){
                          console.log('向右');
                          touchVal.judge = false;
                          if (index != 0){
                              index --;
                              setScrolling(index);
                          }else {
                              touchVal.judge = true;
                          }
                      }
                      touchTime =  setTimeout(function () {
                          touchVal.judgeTime = true;
                          console.log('启动了');
                          timer = setInterval(self,4000);
                      },5000);
                  } else if ( Math.abs(touchVal.X) > Math.abs( touchVal.Y) &&  touchVal.X < 0 ) {
                      if (touchVal.judge){
                          index++;
                          setScrolling(index);
                          touchVal.judge = false;
                          console.log('左');
                      }
                      touchTime =  setTimeout(function () {
                          touchVal.judgeTime = true;
                          console.log('启动了');
                              timer = setInterval(self,4000);
                      },5000);
                  } else if ( Math.abs( touchVal.Y) > Math.abs( touchVal.X) &&  touchVal.Y > 0){
                      touchTime =  setTimeout(function () {
                          timer = setInterval(self,4000);
                      },5000);

                  }else if ( Math.abs(touchVal.Y) > Math.abs(touchVal.X) &&  touchVal.Y < 0 ){
                      touchTime =  setTimeout(function () {
                          timer = setInterval(self,4000);
                      },5000);
                  } else {
                       window.location.href = globalUrl[index];
                      // touchTime =  setTimeout(function () {
                      //     console.log('启动了');
                      //     timer = setInterval(self,4000);
                      // },5000);
                  }
              },false);





};




