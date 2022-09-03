
export const getClosestElement = (el: HTMLElement | null, pred: (el: HTMLElement) => boolean) => {
  while (el) {
    if (pred(el)) return true
    el = el.parentElement
  }
  return false
}
