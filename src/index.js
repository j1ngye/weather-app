import "./styles.css";

function createDropdown(buttonText, listItems) {
  const container = document.querySelector("#container");
  const dropDownContainer = document.createElement("div");
  const button = document.createElement("button");
  const list = document.createElement("ul");

  button.textContent = buttonText;
  button.classList.add("toggle");
  list.style.visibility = "hidden";
  list.classList.add("menu");

  listItems.forEach((listItem) => {
    const item = document.createElement("li");
    item.textContent = listItem.title;
    list.append(item);

    item.addEventListener("click", () => {
      controlMonitor(listItem.title.toLowerCase());
      list.style.visibility = "hidden";
    });
  });

  button.addEventListener("click", () => {
    list.style.visibility =
      list.style.visibility === "hidden" ? "visible" : "hidden";
  });

  dropDownContainer.appendChild(list);
  container.appendChild(button);
  container.appendChild(dropDownContainer);
}

const listitems = [
  { title: "Restart" },
  { title: "Sleep" },
  { title: "Shut down" },
];

createDropdown("Settings", listitems);

function controlMonitor(command) {
  const screen = document.querySelector(".screen");
  switch (command) {
    case "restart":
      screen.style.opacity = "0";
      setTimeout(() => {
        screen.style.opacity = "1";
      }, 5000);
      screen.removeEventListener("click", ChangeBg);
      break;
    case "sleep":
      screen.style.opacity = "0";
      // Remove any existing listener to avoid duplicates
      screen.removeEventListener("click", ChangeBg);
      // Add new listener
      screen.addEventListener("click", ChangeBg);
      break;
    case "shut down":
      screen.style.opacity = "0";
      // Remove any click functionality
      screen.removeEventListener("click", ChangeBg);
      // Make sure no future clicks will change the color
      screen.onclick = null;
      break;
  }
}

function ChangeBg() {
  this.style.opacity = "1";
}
