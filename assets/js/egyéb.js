
  
// *********************** SELECT SIDEBAR ******************************
const sidebarCollapseBtn = document.getElementById('sidebarCollapse');
const sidebar = document.getElementById('sidebar');

// *********************** SELECT CONTENT / FORM ******************************
const range = document.getElementById('formControlRange');
const select = document.getElementById('select-title');
const minCheck = document.getElementById('min-check');
const btnNext = document.getElementById('min-check');

// *********************** SELECT BUTTONS ******************************
const btnScrollOptionStart = document.getElementById('btn-scroll-start');
const btnScrollOptionEnd = document.getElementById('btn-scroll-end');
const btnScrollOptionPrev = document.getElementById('btn-scroll-prev');
const btnScrollOptionNext = document.getElementById('btn-scroll-next');

// ****************************************************************
// *********************** VARIABLES ******************************
// ****************************************************************
// ********************* DISPLAY DATA *****************************
let processedData = [];
let recommendedData = [];
let recommendedSpecData = [];
let originalData = [];
let originalSpecData = [];
let text = "";
let title = "";

// *********************** SEARCH OPTION ******************************
let isMinChecked = false;
let precision = 0.5;

// *********************** PAGINATION ******************************
let selectStart = 0;
let offset = 20;

// *********************** SETS PRECISION ******************************
const setPrecision = (value) => {
  precision = value;
  document.getElementById('range-value').textContent = value;
}

// *********************** GETS DATA FROM FILE ******************************
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
};

// *********************** CALLS SET METHOD FOR CONTENT ON SELECT ******************************
const onOptionChange = (data) => {
  const option = processedData.find(d => d.title == data);
  processData(option);
}

// *********************** FILTERS & DISPLAYS OPTIONS ******************************
const insertOptions = () => {
  select.innerHTML = "";
  processedData.map((data, index) => {
    if(index >= selectStart && index < (selectStart + offset)) {
      let option = document.createElement('option');
      option.innerText = data.title;
      option.value = data.title;
      select.appendChild(option);
    }
  });
  select.selectedIndex = 0;
  onOptionChange(select.value);
};

// *********************** SETS THE CURRENT DATA ******************************
const processData = (data) => {
  recommendedData = [];
  recommendedSpecData = [];
  originalData = [];
  originalSpecData = [];
  let tempObj = {};

  const recommended = data.recommended.split(' '); 
  const recommendedSpec = data.recommendedSpec.split(' '); 
  const original = data.original.split(' ');
  text = data.text;
  title = data.title;
  
  recommended.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = insertSpace(item.replace("__label__", ""));
    }else if(item != "") {
      tempObj.precision = item.trim();
      recommendedData.push(tempObj);
      tempObj = {};
    }
  });

  recommendedSpec.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = insertSpace(item.replace("__label__", ""));
    }else if(item != "") {
      tempObj.precision = item.trim();
      recommendedSpecData.push(tempObj);
      tempObj = {};
    }
  });
  original.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = insertSpace(item.replace("__label__", ""));
      originalData.push(tempObj);
      tempObj = {};
    }else if(item != "") {
      tempObj.label = insertSpace(item);
      originalSpecData.push(tempObj);
      tempObj = {};
    }
  });
  
  insertTextContent("text-content", text);
  callInsertContent();
}

// *********************** REPLACES PLACEHOLDER WITH SPACE ******************************
const insertSpace = (data) => {
  return data.replace(/@{2}/g, "__");
}

// *********************** CREATES LIST FOR LABELS ******************************
const appendList = (data) => {
  let list = document.createElement('li');
  if (data.precision !== undefined) {
    list.textContent = `${data.label} ${data.precision}`;
  }else {
    list.textContent = data.label;
  }
  return list;
}

// *********************** INSERTS LABEL LIST ******************************
const insertLabels = (nodeId, data = []) => {
  const node = document.getElementById(nodeId);
  node.innerHTML = "";
  if(isMinChecked) {
    for(let i = 0; i < data.length && i < 3; i++) {
      node.appendChild(appendList(data[i]));
    }

    for(let i = 3; i < data.length; i++) {
      if(data[i].precision !== undefined) {
        if(data[i].precision >= precision) {
          node.appendChild(appendList(data[i]));
        }
      } else {
        node.appendChild(appendList(data[i]));
      }
    }
  } else {
    for(let i = 0; i < data.length; i++) {
      if(data[i].precision !== undefined) {
        if(data[i].precision >= precision) {
          node.appendChild(appendList(data[i]));
        }
      } else {
        node.appendChild(appendList(data[i]));
      }
    }
  }
};

// *********************** INSERTS TEXT CONTENT ******************************
const insertTextContent = (nodeId, data = "") => {
  const node = document.getElementById(nodeId);
  if(data.length > 550) {
    node.innerHTML = `${data.substr(0, data.indexOf(".", 550))}...`;
  }else {
    node.innerHTML = data;
  }
}

// *********************** DISPLAYS ALL CURRENT DATA ******************************
const callInsertContent = () => {
  insertLabels("original-labels", originalData);
  insertLabels("recommended-labels", recommendedData);
  insertLabels("recommended-spec-labels", recommendedSpecData);
  insertLabels("original-spec-labels", originalSpecData);
};

// ****************************************************************
// ************************ EVENTS ********************************
// ****************************************************************
// ******************** SIDEBAR TOGGLE ****************************
sidebarCollapseBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// ************* RENDERS CONTENT ON OPTION CHANGE *****************
select.addEventListener('change', (e) => onOptionChange(e.target.value));

// ******************** MINIMUM CHECKED ****************************
minCheck.addEventListener('change', () => {
  isMinChecked = !isMinChecked;
  callInsertContent();
});

// ******************** PRECISION CHANGE ****************************
range.addEventListener('input', (e) => {
  setPrecision(e.target.value);
  callInsertContent();
});

// *********************** OPTION PAGINATION ******************************
btnScrollOptionStart.addEventListener('click', () => {
  selectStart = 0;
  insertOptions();
});

btnScrollOptionPrev.addEventListener('click', () => {
  selectStart = selectStart - 20;
  if(selectStart < 0) {
    selectStart = processedData.length - 20;
  }
  insertOptions();
});

btnScrollOptionNext.addEventListener('click', () => {
  selectStart = selectStart + 20;
  if(selectStart + offset >= processedData.length) {
    selectStart = 0;
  }
  insertOptions();
});

btnScrollOptionEnd.addEventListener('click', () => {
  selectStart = processedData.length - 20;
  insertOptions();
});


(function () {
  fetchData();
  setPrecision(range.value);
})();

