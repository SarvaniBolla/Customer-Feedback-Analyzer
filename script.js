function analyzeFeedback() {
    const feedbackText = document.getElementById("feedback-text").value;
    if (!feedbackText) return;
  
    const sentiment = getSentiment(feedbackText);
    const sentimentData = {
      positive: sentiment > 0 ? 1 : 0,
      neutral: sentiment === 0 ? 1 : 0,
      negative: sentiment < 0 ? 1 : 0,
    };
  
    updateCharts(sentimentData);
  }
  
  function getSentiment(text) {
    if (text.includes("good")) return 1;
    if (text.includes("bad")) return -1;
    return 0;
  }
  
  let pieChart, trendChart;
  
  function updateCharts(sentimentData) {
    const pieData = {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        },
      ],
    };
  
    if (!pieChart) {
      pieChart = new Chart(document.getElementById("sentimentPieChart"), {
        type: "pie",
        data: pieData,
        options: {
          animation: {
            animateScale: true,
          },
        },
      });
    } else {
      pieChart.data = pieData;
      pieChart.update();
    }
  
    const trendData = {
      labels: ["Day 1", "Day 2", "Day 3"],
      datasets: [
        {
          label: "Sentiment Over Time",
          data: [1, -1, 1],
          borderColor: "#4A90E2",
          backgroundColor: "rgba(74, 144, 226, 0.2)",
          fill: true,
        },
      ],
    };
  
    if (!trendChart) {
      trendChart = new Chart(document.getElementById("sentimentTrendChart"), {
        type: "line",
        data: trendData,
        options: {
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    } else {
      trendChart.data = trendData;
      trendChart.update();
    }
  }
  
  
  function uploadFile() {
    const fileInput = document.getElementById("file-upload");
    if (!fileInput.files.length) return;
  
    const loader = document.getElementById("loader");
    loader.style.display = "block"; 
  
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const comments = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      
      const feedbackComments = comments.map(row => row[0]).filter(Boolean);
      
     
      feedbackComments.forEach(comment => {
        const sentiment = getSentiment(comment);
        const sentimentData = {
          positive: sentiment > 0 ? 1 : 0,
          neutral: sentiment === 0 ? 1 : 0,
          negative: sentiment < 0 ? 1 : 0,
        };
        updateCharts(sentimentData);
      });
  
      loader.style.display = "none"; 
    };
  
    reader.readAsArrayBuffer(file);
  }