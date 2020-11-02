const fetchData = (url = 'data.txt') => {
  fetch(url)
    .then((response) => response.text())
    .then((text) => text.split('\n'))
    .then((text) => text.map((line) => line.split('$$$')))
    .then((text) => {
      let tempObj = {};
      let indx = 0;
      text.forEach((line) => {
        tempObj.recommended = line[0];
        tempObj.recommendedSpec = line[1];
        tempObj.original = line[2];
        tempObj.title = line[3];
        tempObj.text = line[4];
        tempObj.id = indx++;

        processedData.push(tempObj);
        tempObj = {};
      });
      insertOptions();
    });
};const fetchData = (url = 'data.txt') => {
  fetch(url)
    .then((response) => response.text())
    .then((text) => text.split('\n'))
    .then((text) => text.map((line) => line.split('$$$')))
    .then((text) => {
      let tempObj = {};
      let indx = 0;
      text.forEach((line) => {
        tempObj.recommended = line[0];
        tempObj.recommendedSpec = line[1];
        tempObj.original = line[2];
        tempObj.title = line[3];
        tempObj.text = line[4];
        tempObj.id = indx++;

        processedData.push(tempObj);
        tempObj = {};
      });
      insertOptions();
    });
};