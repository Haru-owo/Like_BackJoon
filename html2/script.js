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
