
document.getElementById("compiler-submit").addEventListener("click", compileCode)

function compileCode(){
    input = document.getElementById("compiler-input").value;
    outputTextarea = document.getElementById("compiler-output");

    let data = {files:[
        { 
            name: "test.xi",
            contents: input
        }
    ], interfaces: []};

    outputTextarea.value = "";
    outputTextarea.disabled = true;

    fetch("https://azure-xi-compiler-20220504031321030.azurewebsites.net/api/xi-compile", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    })
    .then(res => res.text()) 
    .then(text =>  {
        outputTextarea.disabled = false;
        outputTextarea.value = text;
    });
}
