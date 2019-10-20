let view = "full"

let colorOne = new Array(190, 155, 123)
let colorTwo = new Array(133, 68, 66)
let colorThree = new Array(75, 56, 50)

let colorSet = 1 // color index

let audioStream = new Audio()

let songNumber = 1

let repeat = false
let shuffle = false

let previousCurrentTime = 0
let currentSongPlayedFor = 0
let promptAt = 60*30 //prompt at x seconds (30 minutes)

function start() {

    audioStream.volume = 0.65
    audioStream.src = $(".songItem:nth-child(" + songNumber + ")").attr("link")

    updateInformation()
    updateColors()

    audioStream.addEventListener("timeupdate", updateProgress)

    $("#buttonColors").on("click", rotateColors)

    $("#buttonColors").css({ cursor: "pointer" })
    $(".controlButton").css({ cursor: "pointer" })
    $(".songItem").css({ cursor: "pointer" })
    $(".button").css({ cursor: "pointer" })
    $("modal>content>i").css({ cursor: "pointer" })
    $("#buttonAddSong").css({cursor: "pointer"})

    $("#buttonBack").on("click", truncateView)
    $("#buttonPlay").on("click", playSong)
    $("body").on("click", ".songItem", selectSong)
    $("#buttonPrevious").on("click", previousSong)
    $("#buttonNext").on("click", nextSong)
    $("#buttonRepeat").on("click", repeatSong)
    $("#buttonShuffle").on("click", shuffleSong)

    $("#buttonOptions").on("click", openOptions)
    $("#buttonCloseOptions").on("click", closeOptions)

    $("#plus").on("click", notImplemented)
    $("#heart").on("click", notImplemented)

    $("#promptYes").on("click", closePrompt)
    $("#promptNo").on("click", closePromptStopPlayback)
    $("#buttonAddSong").on("click", openAddSongPrompt)
    $("#promptCancel").on("click", closeAddSongPrompt)
    $("#promptAdd").on("click", completeAdd)
    $("#buttonRemoveSong").on("click", removeSong)
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
    if (repeat) {
        $("#buttonRepeat").children("i").css({
            color: "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
        })
    }
    if (shuffle) {
        $("#buttonShuffle").children("i").css({
            color: "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
        })
    }
    $("#optionsMenu>content>border").css({
        "background-color": "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
    })
    $("#optionsMenu>content").css({
        "background-color": "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")"
    })
}

function updateInformation() {
    $("#coverArt>img").attr("src", $(".songItem:nth-child(" + songNumber + ")").children("img").attr("src"))
    $(".currentSong>p>strong").text($(".songItem:nth-child(" + songNumber + ")").children(".songThumb").children("p:nth-child(1)").text())
    $(".currentSong>p:nth-child(2)").text($(".songItem:nth-child(" + songNumber + ")").children(".songThumb").children("p:nth-child(2)").text())
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
        songNumber = 1
    }
    $(".songItem:nth-child(" + songNumber + ")").css({ backgroundColor: "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")" })

    resetCurrentSongPlayedFor()
    audioStream.src = $(".songItem:nth-child(" + songNumber + ")").attr("link")
    audioStream.currentTime = 0
}

function updateProgress() {
    let timeElapsedMinutes = Math.trunc(audioStream.currentTime / 60)
    let timeElapsedSeconds = Math.trunc(audioStream.currentTime % 60)

    let timeTotalMinutes = Math.trunc(audioStream.duration / 60)
    let timeTotalSeconds = Math.trunc(audioStream.duration % 60)

    if (audioStream.currentTime == audioStream.duration) {
        if (repeat) {
            previousCurrentTime = 0
            audioStream.currentTime = 0
            audioStream.play()
        } else if (shuffle) {
            let possibleSongsVector = []
            let songNumberIndex = 0
            for (i = 0; i < $("#mainLeft").children(".songItem").length; i++) {
                if (i + 1 != songNumber) {
                    possibleSongsVector[songNumberIndex] = i + 1
                    songNumberIndex++
                }
            }
            let selectedSong = possibleSongsVector[Math.round(Math.random() * (possibleSongsVector.length - 1))]
            //console.log(selectedSong)
            updateSelected(selectedSong, true)
            updateInformation()
            audioStream.play()
        } else {
            nextSong()
        }
    }

    if (isNaN(audioStream.duration)) {
        $("#progress>#timeElapsed").text("00:00")
        $("#progress>#totalTime").text("00:00")
    } else {
        $("#progress>#timeElapsed").text(String(timeElapsedMinutes).padStart(2, "0") + ":" + String(timeElapsedSeconds).padStart(2, "0"))
        $("#progress>#totalTime").text(String(timeTotalMinutes).padStart(2, "0") + ":" + String(timeTotalSeconds).padStart(2, "0"))

        $("#bar").css({ width: ((audioStream.currentTime / audioStream.duration) * 100) + "%" })
    }

    currentSongPlayedFor += audioStream.currentTime-previousCurrentTime
    previousCurrentTime = audioStream.currentTime
    //console.log(currentSongPlayedFor)
    if(currentSongPlayedFor > promptAt && $("#continuePrompt").css("display")=="none") {
        showPrompt()
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
        audioStream.play()
    } else if ($(this).children("i").attr("class") == "fas fa-pause-circle") {
        $(this).children("i").removeClass("fas fa-pause-circle")
        $(this).children("i").addClass("fas fa-play-circle")
        currentSongPlayedFor = 0
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
    audioStream.play()
}

function previousSong() {
    $("#bar").css({ width: 0 + "%" })
    $("#progress>#timeElapsed").text("00:00")
    if (audioStream.currentTime < 1) {

        updateSelected(-1)
        updateInformation()

        if ($("#buttonPlay>i").attr("class") == "fas fa-pause-circle") {
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
    audioStream.play()
}

function repeatSong() {
    if (!repeat) {
        repeat = true
        $("#buttonRepeat").children("i").css({
            color: "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
        })
    } else {
        repeat = false
        $("#buttonRepeat").children("i").css({
            color: "white"
        })
    }
}

function shuffleSong() {
    if (!shuffle) {
        shuffle = true
        $("#buttonShuffle").children("i").css({
            color: "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
        })
    } else {
        shuffle = false
        $("#buttonShuffle").children("i").css({
            color: "white"
        })
    }
}

function openOptions() {
    $("#optionsMenu").css({
        "display": "flex",
        "width": $("body").css("width"),
        "height": $("body").css("height"),
        "left": "auto",
        "right": "auto"
    })

    $("#optionsMenu>content>border").css({
        "background-color": "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
    })
    $("#optionsMenu>content").css({
        "background-color": "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")"
    })
}

function closeOptions() {
    $("#optionsMenu").css({
        "display": "none"
    })
}

function showPrompt() {
    $("#continuePrompt").css({
        "display": "flex",
        "width": $("body").css("width"),
        "height": $("body").css("height"),
        "left": "auto",
        "right": "auto"
    })
    $("#continuePrompt>content>border").css({
        "background-color": "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
    })
    $("#continuePrompt>content").css({
        "background-color": "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")"
    })
}

function closePrompt() {
    $("#continuePrompt").css({
        "display": "none"
    })
    currentSongPlayedFor = 0
}

function closePromptStopPlayback() {
    closePrompt()
    if ($("#buttonPlay").children("i").attr("class") == "fas fa-pause-circle") {
        $("#buttonPlay").children("i").removeClass("fas fa-pause-circle")
        $("#buttonPlay").children("i").addClass("fas fa-play-circle")
    }
    currentSongPlayedFor = 0
    audioStream.pause()
}

function resetCurrentSongPlayedFor() {
    currentSongPlayedFor = 0
    previousCurrentTime = 0
}

function notImplemented() {
    confirm("UNDER CONSTRUCTION")
}

function openAddSongPrompt() {
    $("#addSongPrompt").css({
        "display": "flex",
        "width": $("body").css("width"),
        "height": $("body").css("height"),
        "left": "auto",
        "right": "auto"
    })

    $("#addSongPrompt>content>border").css({
        "background-color": "rgb(" + colorThree[0] + "," + colorThree[1] + "," + colorThree[2] + ")"
    })
    $("#addSongPrompt>content").css({
        "background-color": "rgb(" + colorOne[0] + "," + colorOne[1] + "," + colorOne[2] + ")"
    })
}

function closeAddSongPrompt() {
    $("#addSongPrompt").css({
        "display": "none"
    })
}

function completeAdd() {
    closeAddSongPrompt()
    $("#mainLeft").append(document.createElement("article"))
    $("#mainLeft>article:last-child").css({
        "height": "10vh",
    })
    $("#mainLeft>article:last-child").attr("class", "songItem")
    $("#mainLeft>article:last-child").attr("link", $("#inputSongLink").val())
    $("#mainLeft>article:last-child").append(document.createElement("img"))
    $("#mainLeft>article:last-child>img").attr("src", $("#inputCoverLink").val())
    $("#mainLeft>article:last-child>img").attr("class", "thumbImage")
    $("#mainLeft>article:last-child").append(document.createElement("section"))
    $("#mainLeft>article:last-child>section").attr("class", "songThumb")
    $("#mainLeft>article:last-child>section").append(document.createElement("p"))
    $("#mainLeft>article:last-child>section>p").append(document.createElement("strong"))
    $("#mainLeft>article:last-child>section>p>strong").text($("#inputArtistName").val())
    $("#mainLeft>article:last-child>section").append(document.createElement("p"))
    $("#mainLeft>article:last-child>section>p:last-child").text($("#inputSongName").val())
    $("#mainLeft>article:last-child").append(document.createElement("section"))
    $("#mainLeft>article:last-child>section:last-child").attr("class", "buttonThumb")
    $("#mainLeft>article:last-child>section:last-child").append(document.createElement("i"))
    $("#mainLeft>article:last-child>section:last-child>i").attr("class", "fas fa-play-circle")
    
}

function removeSong() {
    $("#mainLeft>.songItem:nth-child("+$("#songNumberInput").val()+")").remove()
}