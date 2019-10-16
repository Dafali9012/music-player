let view = "full"

let colorOne = new Array(190, 155, 123)
let colorTwo = new Array(133, 68, 66)
let colorThree = new Array(75, 56, 50)

let colorSet = 1 // color index

let audioStream = new Audio()

let songNumber = 1

let repeat = false;

let myVar

function start() {

    audioStream.volume = 0.65;
    audioStream.src = $(".songItem:nth-child(" + songNumber + ")").attr("link");

    updateInformation()
    updateColors()

    $("#buttonColors").on("click", rotateColors)

    $("#buttonColors").css({ cursor: "pointer" })
    $(".controlButton").css({ cursor: "pointer" })
    $(".songItem").css({ cursor: "pointer" })
    $(".button").css({ cursor: "pointer" })

    $("#buttonBack").on("click", truncateView)
    $("#buttonPlay").on("click", playSong)
    $(".songItem").on("click", selectSong)
    $("#buttonPrevious").on("click", previousSong)
    $("#buttonNext").on("click", nextSong)
    $("#buttonRepeat").on("click", repeatSong)
    $("#buttonShuffle").on("click", shuffleSong)
}

$(start)

function rotateColors() {

    // rotate colors
    if (colorSet == 3) colorSet = 1
    else colorSet++

    switch (colorSet) {
        case 1:
            colorOne = new Array(190, 155, 123)
            colorTwo = new Array(133, 68, 66)
            colorThree = new Array(75, 56, 50)
            break

        case 2:
            colorOne = new Array(118, 180, 189)
            colorTwo = new Array(88, 102, 139)
            colorThree = new Array(94, 86, 86)
            break

        case 3:
            colorOne = new Array(171, 60, 92)
            colorTwo = new Array(79, 50, 72)
            colorThree = new Array(37, 30, 62)
            break
    }
    // set colors
    updateColors()
}

function updateColors() {
    $("#menu").css({ backgroundColor: "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")" })
    $("#mainRight").css({ backgroundColor: "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")" })
    $("#mainLeft").css({ backgroundColor: "rgb(" + colorTwo[0] + "," + colorTwo[1] + "," + colorTwo[2] + ")" })
    $("#progressBar").css({ backgroundColor: "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")" })
    $(".songItem:nth-child(" + songNumber + ")").css({ backgroundColor: "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")" })
}

function updateInformation() {
    $("#coverArt>img").attr("src", $(".songItem:nth-child(" + songNumber + ")").children("img").attr("src"))
    $(".currentSong>p>strong").text($(".songItem:nth-child(" + songNumber + ")").children(".songThumb").children("p:nth-child(1)").text());
    $(".currentSong>p:nth-child(2)").text($(".songItem:nth-child(" + songNumber + ")").children(".songThumb").children("p:nth-child(2)").text());
}

function updateSelected(increment, assignInstead = false) {
    $(".songItem:nth-child(" + songNumber + ")").css({ backgroundColor: "transparent" })
    if (assignInstead) {
        songNumber = increment
    } else if (!assignInstead) {
        songNumber += increment
    }
    if (songNumber < 1) {
        songNumber = $("#mainLeft").children(".songItem").length
    } else if (songNumber > $("#mainLeft").children(".songItem").length) {
        songNumber = 1;
    }
    $(".songItem:nth-child(" + songNumber + ")").css({ backgroundColor: "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")" })

    audioStream.src = $(".songItem:nth-child(" + songNumber + ")").attr("link")
    audioStream.currentTime = 0
}

function updateProgress() {
    let timeElapsedMinutes = Math.trunc(audioStream.currentTime / 60)
    let timeElapsedSeconds = Math.trunc(audioStream.currentTime % 60)

    let timeTotalMinutes = Math.trunc(audioStream.duration / 60)
    let timeTotalSeconds = Math.trunc(audioStream.duration % 60)

    if (audioStream.currentTime == audioStream.duration) {
        if (!repeat) {
            nextSong();
        } else {
            audioStream.currentTime = 0
            audioStream.play()
        }

    }

    if (isNaN(audioStream.duration)) {
        $("#progress>#timeElapsed").text("00:00")
        $("#progress>#totalTime").text("00:00")
    } else {
        $("#bar").css({ width: (audioStream.currentTime / audioStream.duration) * 100 + "%" })

        if (timeElapsedMinutes < 10) {
            if (timeElapsedSeconds < 10) {
                $("#progress>#timeElapsed").text("0" + timeElapsedMinutes + ":0" + timeElapsedSeconds)
            } else {
                $("#progress>#timeElapsed").text("0" + timeElapsedMinutes + ":" + timeElapsedSeconds)
            }
        } else {
            if (timeElapsedSeconds < 10) {
                $("#progress>#timeElapsed").text(timeElapsedMinutes + ":0" + timeElapsedSeconds)
            } else {
                $("#progress>#timeElapsed").text(timeElapsedMinutes + ":" + timeElapsedSeconds)
            }
        }

        if (timeTotalMinutes < 10) {
            if (timeTotalSeconds < 10) {
                $("#progress>#totalTime").text("0" + timeTotalMinutes + ":0" + timeTotalSeconds)
            } else {
                $("#progress>#totalTime").text("0" + timeTotalMinutes + ":" + timeTotalSeconds)
            }
        } else {
            if (timeTotalSeconds < 10) {
                $("#progress>#totalTime").text(timeTotalMinutes + ":0" + timeTotalSeconds)
            } else {
                $("#progress>#totalTime").text(timeTotalMinutes + ":" + timeTotalSeconds)
            }
        }
    }
}

function truncateView() {
    if (view == "full") {
        $("#mainRight").css({ width: 100 + "%" })
        $("#mainLeft").css({ display: "none" })
        view = "truncated"
    } else if (view == "truncated") {
        $("#mainRight").css({ width: 40 + "%" })
        $("#mainLeft").css({ display: "flex" })
        view = "full"
    }
}

function playSong() {

    if ($(this).children("i").attr("class") == "fas fa-play-circle") {
        $(this).children("i").removeClass("fas fa-play-circle")
        $(this).children("i").addClass("fas fa-pause-circle")
        myVar = setInterval(updateProgress, 500)
        audioStream.play()
    } else if ($(this).children("i").attr("class") == "fas fa-pause-circle") {
        $(this).children("i").removeClass("fas fa-pause-circle")
        $(this).children("i").addClass("fas fa-play-circle")
        clearInterval(myVar)
        audioStream.pause()
    }
}

function selectSong() {
    $("#bar").css({ width: 0 + "%" })
    $("#progress>#timeElapsed").text("00:00")
    if ($("#buttonPlay>i").attr("class") == "fas fa-play-circle") {
        $("#buttonPlay>i").removeClass("fas fa-play-circle")
        $("#buttonPlay>i").addClass("fas fa-pause-circle")
    }
    updateSelected($(this).index() + 1, true)
    updateInformation()
    myVar = setInterval(updateProgress, 500)
    audioStream.play()
}

function previousSong() {
    $("#bar").css({ width: 0 + "%" })
    $("#progress>#timeElapsed").text("00:00")
    if (audioStream.currentTime < 1) {

        updateSelected(-1)
        updateInformation()

        if ($("#buttonPlay>i").attr("class") == "fas fa-pause-circle") {
            myVar = setInterval(updateProgress, 500)
            audioStream.play()
        }

    } else {
        audioStream.currentTime = 0
    }
}

function nextSong() {
    $("#bar").css({ width: 0 + "%" })
    $("#progress>#timeElapsed").text("00:00")
    if ($("#buttonPlay>i").attr("class") == "fas fa-play-circle") {
        $("#buttonPlay>i").removeClass("fas fa-play-circle")
        $("#buttonPlay>i").addClass("fas fa-pause-circle")
    }
    updateSelected(1)
    updateInformation()
    myVar = setInterval(updateProgress, 500)
    audioStream.play()
}

function repeatSong() {
    if (!repeat) {
        repeat = true
        $("#buttonRepeat").children("i").css({
            color: "rgb(65,65,65)"
        })
    } else {
        repeat = false
        $("#buttonRepeat").children("i").css({
            color: "white"
        })
    }
}

function shuffleSong() {
    confirm("EJ IMPLEMENTERAD")
}