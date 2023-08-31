export const API_URL = "http://localhost:3000";

// type = "success" or "error"
export function displayPopup(message, type = "success") {
  const popupId = "#global-popup";
  const colorSuccess = "bg-[#30b830]";
  const colorError = "bg-red-600";

  if (type === "success") {
    $(popupId).removeClass(colorError).addClass(colorSuccess);
  } else if (type === "error") {
    $(popupId).removeClass(colorSuccess).addClass(colorError);
  }

  $(`${popupId} p`).text(message);
  $(popupId).fadeIn();
  setTimeout(() => {
    $(popupId).fadeOut();
  }, 3000);
}
