const Google_API_KEY = 'Google_API_KEY';
let audio = null; // 전역 변수로 오디오 엘리먼트 선언

function generateAudio() {
	  const url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + Google_API_KEY;
	  var text = document.getElementById("generated-text").value;
	  const data = {
	        input: {
		      text: text,
	    },
	        voice: {
		      languageCode: 'ko-KR',
		      name: 'ko-KR-Neural2-c',
		      ssmlGender: 'MALE',
	    },
	        audioConfig: {
		      audioEncoding: "MP3",
	    },
	};
	const otherparam = {
	  headers: {
		"content-type": "application/json; charset=UTF-8",
	  },
	  body: JSON.stringify(data),
	  method: "POST",
	};
	// 사운드 생성
	return fetch(url, otherparam)
	  .then((data) => {
		return data.json();
	  })
	  .then((res) => {
		  const audioContent = res.audioContent; // base64 인코딩된 음성 데이터
      return b64toBlob(audioContent, 'audio/mp3');
	  })
	  .catch((error) => {
		  console.log(error);
	  });
}

// base64 문자열을 Blob으로 변환하는 함수
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

function downloadTextFile() {
  // textarea에서 텍스트 가져오기
  var textToWrite = document.getElementById("generated-text").value;

  // Blob 생성
  var blob = new Blob([textToWrite], { type: "text/plain" });

  var url = window.URL.createObjectURL(blob);
  var downloadLink = document.createElement("a");
  downloadLink.download = "KTS_Reader_textFile.txt";
  downloadLink.style.display = 'none';
  downloadLink.href = url;
  document.body.appendChild(downloadLink);

  // 클릭하여 다운로드
  downloadLink.click();
}

function downloadAudioFile() {
  generateAudio().then((audioBlob) => {
    // Blob을 URL로 생성
    const audioURL = URL.createObjectURL(audioBlob);

    // 음성 다운로드 링크 생성
    var downloadLink = document.createElement('a');
    downloadLink.href = audioURL;
    downloadLink.download = "KTS_Reader_audioFile.mp3";
    downloadLink.click(); // 링크 클릭
  }).catch((error) => {
    console.log(error);
  });
}

function readText() {
  // 만약 오디오가 이미 재생 중이면 함수 종료
  if (audio && !audio.paused) {
    audio.pause();
    return;
  }

  generateAudio().then((audioBlob) => {
    const audioURL = URL.createObjectURL(audioBlob);

    // 오디오 엘리먼트 생성
    audio = new Audio(audioURL);

    // 소리 출력
    audio.play();
  }).catch((error) => {
    console.log(error);
  });
}

function toggleTextSection() {
  var outputSection = document.getElementById("generated-text");
  if (outputSection.style.display === "none") {
    outputSection.style.display = "block";
  } else {
    outputSection.style.display = "none";
  }
}

document.getElementById("view-text-button").onclick = toggleTextSection;
