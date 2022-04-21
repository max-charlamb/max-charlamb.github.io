/*
     showEmail(linkid, n, d, x, nm, subj) displays a hyperlinked
     email address when viewed using a JavaScript-capable browser.

     Arguments:
         linkid: The id of the <a> element that should contain the
                 email address. Its class name is set to "email" when the email
                 address is inserted.
	 n: The username of the mail address, with each character
	    xor'ed with x. Pro tip: first try it with the actual username,
            then replace the username with whatever displays in the browser.
	 d: Domainname of the address
         x: the value to xor characters with. You may need to fiddle with this so
            the xor'ed characters are legal in string literals. For extra challenge,
            compute this off a CAPTCHA result.
         nm: the real name of the recipient
	 subj: Subject line of the email (optional)
     
     Example:
     
        <head>
	    ...
	    <script src="email.js" type="text/javascript"></script>
	</head>
	<body>
	...
	<a id="mailto" href="default.html" class="disabled_email">
	    Turn on JavaScript to view the email address
	</a>
	<script type="text/javascript">
	    showEmail("mailto", "KDNX_", "cs.cornell.edu",
			42, "Andrew Myers");
	</script>

    Author: Andrew Myers, 2006
*/

function URI_encode(s) {
    var URI_unreserved = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~";
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (!URI_unreserved.includes(c)) {
            var ci = s.charCodeAt(i);
            s = s.substr(0, i) + "%" + ci.toString(16).substr(0,2) + s.substr(i+1);
            i += 2;
        }
    }
    return s;
}

function showEmail(linkid, n, d, x, nm, subj) {
    var link = document.getElementById(linkid);
    function xor_str(s, x) {
	var ret = "";
	for (i = 0; i < s.length; i++) // 'for i in s' doesn't work in IE
	    ret += String.fromCharCode(s.charCodeAt(i) ^ x);
	return ret;
    }

    n = xor_str(n, x);
   
    var text = document.createTextNode(n + "@" + d);
    if (undefined !== subj) subj = URI_encode(subj);
    n = URI_encode(n);
    nm = URI_encode(nm);

    link.onmouseover = function () {
        for (var i = 0; i < link.childNodes.length; i++)
            link.removeChild(link.childNodes[0]);
	
	var url = "mailto:?to=" + nm + "%20%3C" + n + "%40" + d + "%3E";
	if (subj) {
	    url += "&subject=[" + subj + "]%20"
	}
	link.setAttribute("href", url);
	link.setAttribute("class", "email");
	link.appendChild(text); // must do this after setting url b/c of IE!
    }
    link.onclick = link.onmouseover;
}
