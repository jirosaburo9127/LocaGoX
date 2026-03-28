export function getPublicPillTone(label: string) {
  if (
    label.includes("当日") ||
    label.includes("営業中") ||
    label.includes("今行ける") ||
    label.includes("当日OK")
  ) {
    return "public-pill-success";
  }

  if (
    label.includes("徒歩") ||
    label.includes("駅近") ||
    label.includes("近く") ||
    label.includes("エリア") ||
    label.includes("見返せる")
  ) {
    return "public-pill-info";
  }

  if (
    label.includes("待ち") ||
    label.includes("最終受付") ||
    label.includes("時間") ||
    label.includes("夜") ||
    label.includes("19:00") ||
    label.includes("20:00")
  ) {
    return "public-pill-warning";
  }

  if (
    label.includes("静か") ||
    label.includes("個室") ||
    label.includes("姿勢") ||
    label.includes("ヘッドスパ") ||
    label.includes("ブース") ||
    label.includes("雰囲気")
  ) {
    return "public-pill-accent";
  }

  return "public-pill-neutral";
}

export function getPublicPillClassName(label: string, extraClassName?: string) {
  const parts = ["public-pill", getPublicPillTone(label)];

  if (extraClassName) {
    parts.push(extraClassName);
  }

  return parts.join(" ");
}
