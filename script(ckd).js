document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // ��� �ǿ��� active ����
      tabs.forEach(t => t.classList.remove("active"));
      // Ŭ���� �ǿ� active �߰�
      tab.classList.add("active");

      // ��� ������ ����
      contents.forEach(content => content.style.display = "none");

      // Ŭ���� ���� ������ ���̱�
      const selectedId = tab.getAttribute("data-tab");
      document.getElementById(selectedId).style.display = "block";
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // 상위 탭 전환
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach(content => content.classList.add("hidden"));
      const selectedId = tab.getAttribute("data-tab");
      document.getElementById(selectedId).classList.remove("hidden");
    });
  });

  // 하위 탭 전환 (단계 탭 내)
  const subTabs = document.querySelectorAll(".sub-tab");
  const subContents = document.querySelectorAll(".sub-tab-content");

  subTabs.forEach(sub => {
    sub.addEventListener("click", () => {
      subTabs.forEach(s => s.classList.remove("active"));
      sub.classList.add("active");

      subContents.forEach(c => c.classList.add("hidden"));
      const selected = sub.getAttribute("data-sub");
      document.getElementById(selected).classList.remove("hidden");
    });
  });
});