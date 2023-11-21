// 메인 UI
// 각 화면 전환 마다 영향이 있는 UI는 uiMain 함수 안에서 활용한다.
// 화면 전환시공통으로 쓰일 다음, 이전 인덱스는 next와 prev로 활용한다.
function main(){
    
    var SECTION_TIME = 1250, // 화면 전환 시간
        CNT_TIME = 150, // 컨텐츠 영역 전환 시간
        BG_TIME = 40, // 백그라운드 전환 시간
        $win = null, // 윈도우 객체
        $dom = null, // 돔 영역
        $section = null, // 메인 세션
        $logo = null, // 로고
        $navBtn = null, // 네비게이션
        $indi = null, // 인디게이터
        $indiLi = null, // 인디게이터 리스트
        $slideArr = null, // 다음 버튼
        $visit = null, // 접속자
        bgSet = null, // 백그라운드 전환 타이머
        timer = null, // 윈도우 리사이징 감지 타이머
        moveing = null, // 이벤트 중복 실행 방지
        delta, // 마우스 휠 값
        next, // 다음 화면 인덱스
        prev, // 이전 화면 인덱스
        top, // 윈도우 상단 좌표
        left; // 윈도우 왼쪽 좌표

    // 초기화
    function init(){
        $win = $(window);
        $dom = $('html, body');
        $section = $('.main > section');
        $logo = $('h1.logo');
        $navBtn = $('.navBtn');
        $indi = $('.main .indi');
        $indiLi = $indi.children('li');
        $indiLi.eq(0).addClass('on');
        $slideArr = $('.main .slideArr');
        $visit = $('#visit');
        moveing = false;
        delta = 0;
        next = 0;
        top = 0;
        left = 0;
    }

    // 이벤트 초기화
    function initEvent(){
        
        // 스크롤 제거
        scrollDelete();
        
        // 윈도우 사이즈 초기화
        winView(0, 0, 500);
        
        // 메인 타이틀 텍스트 효과
        setTimeout(function(){
            if(moveing === false){
                moveing = true;
                titMove();
            };
        }, 1000);
        
        // 마우스 휠 이벤트
        $dom.on('mousewheel DOMMouseScroll', function(e){
            if(e.originalEvent.detail){
                delta = e.originalEvent.detail * -40;
            }else{
                delta = e.originalEvent.wheelDelta;
            };
            scroll(delta);
        });
        
        // 인디게이터 클릭 이벤트
        $indi.children('li').on('click', function(){
            if(moveing === false){
                moveing = true;
                next = $(this).index();
                move($section.eq(next), $section.eq(prev));
            };
        });
        
        // 화살표 클릭 이벤트
        $slideArr.on('click', function(){
            if(moveing === false){
                moveing = true;
                next++;
                if(next >= $section.length){
                    next = 0;
                };
                move($section.eq(next), $section.eq(prev));
            };
        });
        
        // 윈도우 사이즈 리사이징
        $win.on('resize', function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                winAxis();
                winView(top, left, 300);
            }, 150);
        });
        
    }
    
    // 스크롤 제거
    function scrollDelete(){
        if($dom.find('#container .wrap > div').hasClass('main')){
            $('html').css({
                overflowY: 'hidden'
            });
        };
    }
    
    // 이동할 좌표 감지
    function winAxis(){
        top = $section.eq(next).offset().top;
        left = $section.eq(next).offset().left;
    }
    
    // 돔 이동
    function winView(x, y, time){
        $dom.animate({
            scrollTop: x,
            scrollLeft: y
        }, time);
    }
    
    // 마우스 휠
    function scroll(delta){
        if(moveing === false){
            moveing = true;
            if(delta > 0){
                next++;
                if(next >= $section.length){
                    next = 0;
                };
                move($section.eq(next), $section.eq(prev));
            }else{
                next--;
                if(next < 0){
                    next = $section.length - 1;
                };
                move($section.eq(next), $section.eq(prev));
            };
        };
    }
    
    // 화면 전환
    function move($next, $prev){
        winAxis();
        $dom.animate({
            scrollTop: top,
            scrollLeft: left
        }, SECTION_TIME, 'easeOutQuint');
        fixedEffect('type01', 'type02', 'type03', 'type04');
        bgEffect($next);
        setTimeout(function(){
            cntEffext($next, $prev);
            titMove();
            prev = next;
        }, SECTION_TIME);
    }

    // 고정 UI 이펙트
    function fixedEffect(){
        $indiLi.eq(next).addClass('on').siblings('li').removeClass('on');
        var fixed = [$logo, $navBtn, $indi, $slideArr, $visit];
        for(var i = 0;i < fixed.length;i++){
            fixed[i].addClass(arguments[next]);
            if(prev !== undefined){
                fixed[i].removeClass(arguments[prev]);
            };
        };
    }
    
    // 컨텐츠 영역 이펙트
    function cntEffext($next, $prev){
        var $recent = $next.find('article.move > div'),
            cntSet = null,
            num = 0;
        cntSet = setInterval(function(){
            $recent.eq(num).addClass('on');
            num++;
            $recent.eq(num).addClass('on');
            if(num >= $recent.length){
                clearInterval(cntSet);
                if(next !== 0){
                    moveing = false;
                };
            };
        }, CNT_TIME);
        $next.addClass('on').siblings('section').removeClass('on');
        $prev.find('article.move > div').removeClass('on');
    }

    // 배경 이펙트
    function bgEffect($next){
        var $recentBg = $next.children('.bg'),
            bgX = 2500 - $win.width();
            bgNum = 0;
        $recentBg.css('backgroundPositionX', 0);
        clearInterval(bgSet);
        if(next === 1 || next === 2 || next === 3){
            bgSet = setInterval(function(){
                bgMove();
            }, BG_TIME);
        };
        $win.on('resize', function(){
            bgX = 2500 - $win.width();
        });
        function bgMove(){
            bgNum++;
            $recentBg.css('backgroundPositionX', -bgNum);
            if(bgNum >= bgX){
                clearInterval(bgSet);
                $recentBg.css('background-position-x', 'right');
            };
        }
    }

    // 메인화면 텍스트 이펙트
    function titMove(){
        var $titBg = $('.box01 .titBg'),
            $titTop = $('.box01 .tit .top'),
            $titCenter = $('.box01 .tit .center'),
            $titBottom = $('.box01 .tit .bottom');
        if(next === 0){
            move1();
        }else{
            $titBg.css({
                left: '100%',
                right: 'initial',
                opacity: 0,
                backgroundColor: '#006699'
            });
            $titTop.removeClass('on');
            $titCenter.children('span').removeClass('on');
            $titBottom.removeClass('on');
        };
        function move1(){
            $titBg.animate({
                opacity: '1',
                left: '50%',
                margin: '-138px 0 0 -308px',
            }, 350, 'easeOutQuart', function(){
                move2();
            });
        }
        function move2(){
            $titBg.animate({
                width: '120px'
            }, 150, 'easeOutQuart');
            addOn($titTop, $titCenter.children('.txtL'));
            move3();
        }
        function move3(){
            setTimeout(function(){
                $titBg.animate({
                    margin: '23px 0 0 -308px'
                }, 250, 'easeOutQuart', function(){
                    addOn($titBottom, $titCenter.children('.txtR'));
                    move4();
                });
            }, 750);
        } 
        function move4(){
            setTimeout(function(){
                $titBg.animate({
                    margin: '23px 0px 0 138px',
                    backgroundColor: '#99ccff'
                }, 250, 'easeOutQuart');
                move5();
            }, 150);
        }
        function move5(){
            setTimeout(function(){
                $titBg.css({
                    left: 'auto',
                    right: '50%',
                    margin: '23px -258px 0 0'
                });
                move6();
            }, 500);
        }
        function move6(){
            setTimeout(function(){
                $titBg.animate({
                    width: '100%'
                }, 300, 'easeOutQuart', function(){
                    $titBg.animate({
                        right: '100%',
                        margin: '23px 0 0 0',
                        opacity: 0
                    }, 150, function(){
                        $titBg.css({
                            marginTop: '-138px'
                        });
                    });
                    moveing = false;
                });
            }, 250);
        }
        function addOn(target1, target2){
            setTimeout(function(){
                target1.addClass('on');
                target2.addClass('on');
            }, 300);
        }
    }

    init();
    initEvent();
    
}

// 화살표 이펙트
function slideArr(){
    var $slideArr = null;
    function init(){
        $slideArr = $('.wrap .slideArr');
    }
    function initEvent(){
        setInterval(function(){
            arrMove();
        }, 500);
    }
    function arrMove(){
        $slideArr.toggleClass('on');
    }
    init();
    initEvent();
}


// 실행
$(function(){
    main();
    slideArr();
});
