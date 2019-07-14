module.exports = {
  hooks: {
    'page:before': function(page) {
      var str =
        "<script>\n      function attachComments() {\n        const el = document.querySelector('.markdown-section');\n        if (!el) return;\n        const script = document.createElement('script');\n        script.src = 'https://utteranc.es/client.js';\n        script.setAttribute('repo', 'velopert/react-tutorial');\n        script.setAttribute('issue-term', 'title');\n        script.setAttribute('crossorigin', 'anonymous');\n        script.setAttribute('label', 'comments');\n        el.appendChild(script);\n      }\n      setTimeout(attachComments, 100);\n    </script>";
      page.content = page.content + str;
      return page;
    }
  }
};
