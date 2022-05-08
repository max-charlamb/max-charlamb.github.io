
document.getElementById("compiler-submit").addEventListener("click", compileCode)

function compileCode(){
    input = document.getElementById("compiler-input").value;
    let data = {files:[
        { 
            name: "test.xi",
            contents: input
        }
    ], interfaces: []};

    fetch("https://azure-xi-compiler-20220504031321030.azurewebsites.net/api/xi-compile", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    })
    .then(res => res.text()) 
    .then(text =>  {
        outputTextarea = document.getElementById("compiler-output");
        outputTextarea.value = text;
    });
}
