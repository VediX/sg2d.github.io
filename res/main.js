//fetch("/doc/sg2d-application.md").then(async function(response) {
fetch("/README.md").then(async function(response) {
	let converter = new showdown.Converter({ tables: true, literalMidWordUnderscoes: true });
	let text = await response.text();
	let html = converter.makeHtml(text);
	
	let ta = document.createElement("textarea");
	ta.innerHTML = html;
	html = ta.value;

	let div = document.querySelector("#markdown_content");
	div.innerHTML = html;
	div.style.display = "block";
	
	document.querySelectorAll("H1,H2,H3").forEach((h1)=>{
		h1.id = h1.innerText.toLowerCase().replaceAll(/[,=\{\}\(\)"'\.…\[\]\/]/g, "").replaceAll(" ", "-");
	});
	
	document.querySelectorAll("code.language-html, code.html").forEach(function(element) {
		element.innerHTML = element.innerHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	});
	
	hljs.highlightAll();
});