// 문제 분류 데이터
const stepProblems = {
  math: [
    { id: "0101", title: "A+B", level: "Bronze 5", href: "1.html" },
    { id: "0102", title: "A-B", level: "Bronze 5", href: "2.html" },
    { id: "0103", title: "A/B", level: "Bronze 5", href: "2.html" },
    { id: "0104", title: "A*B", level: "Bronze 5", href: "2.html" },
    { id: "0105", title: "약수", level: "Bronze 1", href: "2.html" },
    { id: "0106", title: "최소공배수", level: "Bronze 1", href: "2.html" },
  ],
  string: [
    { id: "0207", title: "펠린드롬 문장", level: "Silver 4", href: "2.html" },
    { id: "0210", title: "문자열 반복", level: "Bronze 2", href: "2.html" },
    { id: "0211", title: "문자와 문자열", level: "Bronze 5", href: "2.html" },
    { id: "0212", title: "알파벳 찾기", level: "Bronze 2", href: "2.html" },
  ],
  array: [
    { id: "0301", title: "배열의 평균", level: "Bronze 4", href: "array1.html" },
    { id: "0302", title: "2차원 배열 탐색", level: "Bronze 2", href: "array2.html" },
    { id: "2738", title: "행렬 덧셈", level: "Bronze 3", href: "array3.html" },
    { id: "16926", title: "배열 돌리기 1", level: "Silver 5", href: "array4.html" },
    { id: "1845", title: "배열 회전", level: "Ruby 1", href: "array5.html" }
  ],
  structure: [
    { id: "0401", title: "학생 정보 구조체", level: "Bronze 3", href: "struct1.html" },
    { id: "0402", title: "도서 관리 구조체", level: "Silver 5", href: "struct2.html" },
    { id: "10814", title: "나이순 정렬", level: "Bronze 2", href: "struct3.html" },
    { id: "10825", title: "국영수", level: "Silver 4", href: "struct4.html" }
  ]
};

function showStepDetail(category) {
  document.getElementById("step").classList.add("hidden");
  document.getElementById("step-detail").classList.remove("hidden");

  const table = document.getElementById("step-detail-table");
  const rows = stepProblems[category].map(p => `
    <tr onclick="location.href='${p.href}'">
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.level}</td>
    </tr>`).join("");

  table.innerHTML = `
    <thead><tr><th>📌문제</th><th>문제제목</th><th>정보</th></tr></thead>
    <tbody>${rows}</tbody>`;
}

function backToStep() {
  document.getElementById("step-detail").classList.add("hidden");
  document.getElementById("step").classList.remove("hidden");
}

function applySearch(keyword) {
  let visibleContent = Array.from(document.querySelectorAll(".tab-content"))
    .find(content => !content.classList.contains("hidden"));

  const isStepDetailVisible = document.getElementById("step-detail")?.classList.contains("hidden") === false;
  if (visibleContent?.id === "step-detail" || isStepDetailVisible) {
    document.getElementById("step-detail").classList.add("hidden");
    document.getElementById("step").classList.remove("hidden");
    visibleContent = document.getElementById("step");
  }

  if (visibleContent.id === "step") {
    const allStepRows = document.querySelectorAll("#step tbody tr");
    allStepRows.forEach(row => {
      const category = row.getAttribute("data-category");
      const matched = stepProblems[category]?.some(p =>
        p.title.toLowerCase().includes(keyword)
      );
      row.style.display = matched || keyword === "" ? "" : "none";
    });
    return;
  }

  const rows = visibleContent.querySelectorAll("tbody tr");
  rows.forEach(row => {
    const titleCell = row.querySelector("td:nth-child(2)");
    const text = titleCell ? titleCell.textContent.toLowerCase() : "";
    row.style.display = text.includes(keyword) ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const searchInput = document.getElementById("search-input");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const selectedId = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      tabContents.forEach(content => content.classList.add("hidden"));
      document.getElementById(selectedId).classList.remove("hidden");

      if (selectedId === "step") {
        document.getElementById("step-detail").classList.add("hidden");
      } else {
        document.getElementById("step").classList.add("hidden");
        document.getElementById("step-detail").classList.add("hidden");
      }

      if (searchInput) {
        searchInput.value = "";
        applySearch("");
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase();
      applySearch(keyword);
    });
  }
});
