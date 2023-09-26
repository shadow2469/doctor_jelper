let inputs = [];
let data = {};
let keys = [];
let userAnswers = {};

let pathname = window.location.pathname;
// Discard the last component of the path.
pathname = pathname.substring(0, pathname.lastIndexOf("/"));

let current = 0;
(async () => {
    const response = await fetch(`${pathname}/res/images.json`);
    data = await response.json();
    // Shuffle data.
    keys = Object.keys(data.mapping);
    for (let i = 0; i < keys.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
    }

    next();
})();

function formattedTime(t) {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function createImage(path) {
    const img = document.createElement("img");
    img.src = `${pathname}/res/images/${path}`;
    img.style.height = "360px";
    img.style.objectFit = "contain";
    return img;
}

let times = {};
let timerId = null;
let duration = 0;
function next() {
    const time = document.getElementById("time");
    timerId = setInterval(() => {
        duration++;
        time.innerText = formattedTime(duration);
    }, 1000);

    const key = keys[current];
    const container = document.getElementById("container");
    // Remove all children.
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const img = createImage(data.mapping[key]);
    container.appendChild(img);

    const input = document.createElement("input");
    input.type = "text";
    input.name = "result";
    input.style.maxWidth = "500px";
    inputs.push(input);
    container.appendChild(input);

    const button = document.createElement("button");
    button.innerText = current === keys.length - 1 ? "提交" : "下一题";
    button.onclick = () => {
        const value = input.value;
        if (value.length === 0) {
            return;
        }

        userAnswers[key] = value;
        times[key] = duration;
        resetTimer();

        if (current === keys.length - 1) {
            submit();
        } else {
            current++;
            next();
        }
    };
    container.appendChild(button);
}

function resetTimer() {
    clearInterval(timerId);
    duration = 0;
    const time = document.getElementById("time");
    time.innerText = "0:00";
}

async function submit() {
    document.getElementById("examination").remove();
    const resultElement = document.getElementById("result");
    resultElement.style.display = "flex";

    const totalDuration = Object.values(times).reduce((a, b) => a + b, 0);
    document.getElementById("total-time").innerText =
        formattedTime(totalDuration);
    const averageDuration = totalDuration / keys.length;
    document.getElementById("avg-time").innerText =
        formattedTime(averageDuration);

    const response = await fetch(`${pathname}/res/answers.json`);
    const answers = await response.json();

    let correctCount = 0;
    let originCorrectCount = 0;
    let enhancedCorrectCount = 0;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const result = userAnswers[key];
        const answer = answers[key];
        if (result === answer) {
            correctCount++;
            if (data.enhanced[key]) {
                enhancedCorrectCount++;
            } else {
                originCorrectCount++;
            }
        }

        const container = document.createElement("div");
        const img = createImage(data.mapping[key]);
        const time = document.createElement("p");
        const user = document.createElement("p");
        const correct = document.createElement("p");
        time.innerText = `用时：${formattedTime(times[key])}`;
        user.innerText = `你的答案：${result}`;
        correct.innerText = `正确答案：${answer}`;
        container.appendChild(img);
        container.appendChild(time);
        container.appendChild(user);
        container.appendChild(correct);

        resultElement.appendChild(container);
    }

    function percent(x) {
        return `${((x / keys.length) * 100).toFixed(2)}%`;
    }
    document.getElementById("accuracy").innerText = percent(correctCount);

    const originCount = Object.keys(data.origin).length;
    const enhancedCount = Object.keys(data.enhanced).length;
    const originAccuracy = originCorrectCount / originCount;
    const enhancedAccuracy = enhancedCorrectCount / enhancedCount;
    document.getElementById("accuracy-o").innerText = percent(originAccuracy);
    document.getElementById("accuracy-e").innerText = percent(enhancedAccuracy);

    const downloadButton = document.createElement("button");
    downloadButton.innerText = "下载结果";
    downloadButton.onclick = () => {
        const result = {
            "total-duration": totalDuration,
            "average-duration": averageDuration,
            accuracy: correctCount,
            "origin-accuracy": originAccuracy,
            "enhanced-accuracy": enhancedAccuracy,
        };

        // Convert result to CSV.
        const csv = Object.entries(result)
            .map(([key, value]) => `${key},${value}`)
            .join("\n");
        downloadFile(csv, "result.csv");
    };
    resultElement.appendChild(downloadButton);
}

function downloadFile(data, name) {
    // Create an invisible A element
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/csv" }));

    // Use download attribute to set set desired file name
    a.setAttribute("download", name);

    // Trigger the download by simulating click
    a.click();
}
