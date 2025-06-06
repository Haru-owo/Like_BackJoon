document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const selectedId = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      tabContents.forEach(content => content.classList.add("hidden"));
      document.getElementById(selectedId).classList.remove("hidden");

      if (selectedId === "step") {
        document.getElementById("step").classList.remove("hidden");
        document.getElementById("step-detail").classList.add("hidden");
      } else {
        document.getElementById("step").classList.add("hidden");
        document.getElementById("step-detail").classList.add("hidden");
      }
    });
  });
});

const stepProblems = {
  math: [
    { id: "0101", title: "괄호 계산", level: "Bronze", href: "math1.html" },
    { id: "0102", title: "사칙 연산", level: "Silver", href: "math2.html" },
  ],
  string: [
    { id: "0201", title: "회문 검사", level: "Silver", href: "string1.html" },
    { id: "0202", title: "문자열 뒤집기", level: "Silver", href: "string2.html" },
  ],
};

function showStepDetail(category) {
  document.getElementById("step").classList.add("hidden");
  document.getElementById("step-detail").classList.remove("hidden");

  const table = document.getElementById("step-detail-table");
  const rows = stepProblems[category]
    .map(
      p => `
      <tr onclick="location.href='${p.href}'">
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.level}</td>
      </tr>`
    )
    .join("");

  table.innerHTML = `
    <thead>
      <tr><th>📌문제</th><th>문제제목</th><th>정보</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  `;
}

function backToStep() {
  document.getElementById("step-detail").classList.add("hidden");
  document.getElementById("step").classList.remove("hidden");
}