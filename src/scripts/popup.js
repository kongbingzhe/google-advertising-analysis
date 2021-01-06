const button1 = document.getElementById("black&white")
const result = document.querySelector('.popup-result')
button1.addEventListener('click', analyseBAndW)

function analyseBAndW () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "black&white",
                value: true
            });
        }
    });
}