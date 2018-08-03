/**
 * Created by Administrator on 2017/12/28 0028.
 */
(function() {
    // form
    var commentCon = document.getElementById('comments');
    var comForm = commentCon.getElementsByClassName('textarea-container')[0];
    var userIpt = comForm.getElementsByTagName('input')[0];
    var emailIpt = comForm.getElementsByTagName('input')[1];
    var websiteIpt = comForm.getElementsByTagName('input')[2];
    var textarea = comForm.getElementsByTagName('textarea')[0];
    var authorInfo = commentCon.getElementsByClassName('author-info')[0];
    var inputDiv = authorInfo.getElementsByClassName('input-div');
    var loginUser = commentCon.getElementsByClassName('logined')[0];
    // 判断本地是否有登录记录
    var user = ms.get('user');
    if (user) {
        userIpt.value = user.nickname;
        emailIpt.value = user.email;
        websiteIpt.value = user.website;
        authorInfo.style.display = "none";
        loginUser.style.display = "block";
    }
    var deleteUser = loginUser.getElementsByClassName('delete-user')[0];
    if (deleteUser) {
        deleteUser.onclick = function() {
            ms.remove('user');
            loginUser.style.display = "none";
            authorInfo.style.display = "block";
        };
    }
    // 本地存储用户
    function saveUser(key, val) {
        if (!ms.get(user)) {
            ms.set(key, val);
        }
    }

    var commentChildren = document.getElementsByClassName('comment-children');
    // var childrenLi;
    // for (var c=0; c<commentChildren.length; c++) {
    //     childrenLi = commentChildren[c].getElementsByTagName('li');
    //     for (var l=0; l<childrenLi.length; l++) {
    //
    //         childrenLi[l].onmouseenter = function() {
    //             var childrenName = this.getElementsByClassName('comment-name')[0];
    //             var childrenReply = this.getElementsByClassName('reply-comment')[0];
    //             childrenName.style.display = "block";
    //             childrenReply.style.display = "block";
    //         };
    //         childrenLi[l].onmouseleave = function() {
    //             var childrenName = this.getElementsByClassName('comment-name')[0];
    //             var childrenReply = this.getElementsByClassName('reply-comment')[0];
    //             childrenName.style.display = "none";
    //             childrenReply.style.display = "none";
    //         }
    //     }
    // }


    // 回复按钮
    var commentIpt = document.getElementsByClassName('comment-send')[0];
    var replyBtns = commentCon.getElementsByClassName('comment-reply-link');

    for (var b=0; b<replyBtns.length; b++) {
        replyBtns[b].onclick = function() {
            var currentId = this.attributes["curid"].value;
            var replyId = this.attributes["replyid"].value;
            var replyTo = this.attributes["replyto"].value;
            var comment = document.getElementById(currentId);
            var cancel = commentIpt.getElementsByClassName('cancel')[0];
            var submitBtn = commentIpt.getElementsByClassName('comment-submit')[0];

            submitBtn.attributes["replyid"].value = replyId;
            submitBtn.attributes["replyto"].value = replyTo;
            cancel.style.display = 'inline-block';
            comment.appendChild(commentIpt);
        }
    }

    // 取消按钮
    var cancel = commentIpt.getElementsByClassName('cancel')[0];
    // 表单复原
    function resetForm(ele) {
        var cancelPar = ele.parentElement.parentElement.parentElement;
        var submitBtn = commentIpt.getElementsByClassName('comment-submit')[0];

        submitBtn.attributes["replyid"].value = "";
        submitBtn.attributes["replyto"].value = "";
        cancel.style.display = 'none';

        cancelPar.removeChild(commentIpt);
        commentCon.appendChild(commentIpt);
    }
    cancel.onclick = function() {
        resetForm(cancel)
    };

    function success(key, val) {
        var text = document.getElementsByClassName('comment-list')[0];
        var msg = '<li class="comment" style="color: #df846c;">评论将在通过后展示...</li>';

        text.innerHTML+=msg;
    }

    function fail() {
        var text = document.getElementsByClassName('comment-list')[0];
        var msg = '<li class="comment" style="color: #df846c;">发布评论失败...</li>';

        text.innerHTML+=msg;
    }
    // 发布按钮
    var submitBtn = commentIpt.getElementsByClassName('comment-submit')[0];
    submitBtn.onclick = function() {
        var replyId = this.attributes["replyid"].value;
        var replyTo = this.attributes["replyto"].value;
        var postUrl = this.attributes["posturl"].value;
        var emailRe = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if (userIpt.value && emailIpt.value && textarea.value !== null && emailRe.test(emailIpt.value)) {
            resetForm(submitBtn);
            postClick(postUrl, replyId, replyTo);
        } else {
            alert('请正确填写必填项...')
        }

    };

    function postClick(url, replyId, replyName) {
        var request;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    return success();
                } else {
                    return fail();
                }
            } else {

            }
        };
        if (replyId) {
            request.open('POST', '/'+ url +'/comment');
            request.setRequestHeader('Content-Type', 'application/json');
            nickname = userIpt.value;
            website = websiteIpt.value;
            if (website.length > 4) {
                comment = '<p class="reply-header"><a class="comment-user" href="'+website+'" target="_blank">'+nickname+'</a>'+ '<span>回复</span> '+replyName+'：</p>'+textarea.value;
            } else {
                comment = '<p class="reply-header">' + nickname +  '<span>回复</span>' + ' ' + replyName + '：</p>' + textarea.value;
            }
            FormData= JSON.stringify({
                nickname: nickname,
                email: emailIpt.value,
                website: website,
                comment: comment,
                isReply: true,
                replyTo: replyId
            });
            var val1 = {nickname:userIpt.value,email: emailIpt.value,website: websiteIpt.value};
            saveUser('user', val1);
            request.send(FormData);
        } else {
            console.log(url);
            request.open('POST', '/'+ url +'/comment');
            request.setRequestHeader('Content-Type', 'application/json');
            FormData= JSON.stringify({
                nickname: userIpt.value,
                email: emailIpt.value,
                website: websiteIpt.value,
                comment: textarea.value
            });
            var val2 = {nickname:userIpt.value,email: emailIpt.value,website: websiteIpt.value};
            saveUser('user', val2);
            request.send(FormData);
        }
        textarea.value = "";
    }

})();

