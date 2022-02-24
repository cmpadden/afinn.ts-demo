import "./style.css";
import Afinn from "afinn.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                               Premade Sentences                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const sentences = [
  { lang: "en", sentence: "This is utterly excellent!" },
  {
    lang: "da",
    sentence: "Hvis ikke det er det mest afskyelige flueknepperi...",
  },
  {
    lang: "fi",
    sentence: "Siellä on uusi hyvä juttu, katsokaa ja kuunnelkaa ihmeessä.",
  },
  { lang: "sv", sentence: "det är inte bra" },
  { lang: "tr", sentence: "iyi değil" },
  { lang: "emoticons", sentence: "I saw that yesterday :)" },
];

// instantiate table
const table = document.getElementById(
  "example-sentence-table"
) as HTMLTableElement;

// set header
const tr = document.createElement("tr");
tr.innerHTML =
  '<th class="lang">Language</th><th class="sentence">Sentence</th><th class="score">Score</th>';
table.append(tr);

// append rows of sentiment scores
sentences.forEach((e) => {
  const a = new Afinn({ language: e.lang });
  const s = a.score(e.sentence);
  const tr = document.createElement("tr");
  tr.innerHTML = `<td class="lang">${e.lang}</td><td class="sentence">${e.sentence}</td><td class="score">${s}</td>`;
  table.append(tr);
});
app.append(table);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   Free-form                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Surround `word` occurrences in `text` with span tags and specified `class`
 */
function highlightWords(
  text: string,
  word: string,
  classes?: string,
  title?: string
) {
  const pattern = "(?<=^|[\\P{L}])(" + word + ")(?=$|[\\P{L}])";
  return text.replace(
    new RegExp(pattern, "gmui"),
    `<span class="${classes}" title="${title}">$1</span>`
  );
}

/**
 * Compute scores, and then highlight words given their score by wrapping them in <span> elements
 */
function constructAnnotatedText(text: string): string {
  const scores = afinn.scores(input.value);
  scores.forEach((s) => {
    const classes = s.score > 0 ? "positive" : s.score < 0 ? "negative" : "";
    text = highlightWords(text, s.word, classes, s.score.toString());
  });
  return text;
}

const afinn = new Afinn({ language: "en" });

const input = document.getElementById("text-input") as HTMLTextAreaElement;
const annotatedText = document.getElementById("annotated-text") as HTMLDivElement;
const score = document.getElementById("overall-score") as HTMLDivElement;

// Initially set scores
score.innerHTML = afinn.score(input.value).toString();
annotatedText.innerHTML = constructAnnotatedText(input.value);

// Setup listener to dynamically set score based on input text
input.addEventListener("input", (_event) => {
  score.innerHTML = afinn.score(input.value).toString();
  annotatedText.innerHTML = constructAnnotatedText(input.value);
});
