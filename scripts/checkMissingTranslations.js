const en = require("../public/locales/en-US/common.json");
const pt = require("../public/locales/pt-BR/common.json");

const flatten = (json) => {
  const result = new Map();

  const traverse = (translation, prefix = "") => {
    Object.keys(translation).forEach((key) => {
      if (typeof translation[key] === "object") {
        traverse(translation[key], prefix + key + ".");
      } else {
        result.set(prefix + key, translation[key]);
      }
    });
  };

  traverse(json);
  return result;
};

const unique = (arr) => {
  const result = [];
  // Por conta da ordem de adição dos itens, as chaves não encontradas em PT vão estar por padrão na língua inglesa
  // e as chaves não encontradas em ES ou EN vão estar por padrão na língua portuguesa
  arr.forEach((item) => {
    !result.some((r) => r.key === item.key)
      ? result.push({...item, onlyCommonFileMissingThisTranslation: false})
      : result.find((r) => r.key === item.key).onlyCommonFileMissingThisTranslation = true;
  });
  return result;
};

const flatEn = flatten(en)
const flatPt = flatten(pt);

// Arrays para armazenar chaves faltantes
const missingInPt = [];
const missingInEn = [];

// 1. Verifica chaves que existem em PT mas faltam em EN
flatPt.forEach((ptValue, key) => {
  if (!flatEn.has(key)) {
    missingInEn.push({ key, ptValue });
  }
});

// 2. Verifica chaves que existem em EN mas faltam em PT
flatEn.forEach((enValue, key) => {
  if (!flatPt.has(key)) {
    missingInPt.push({ key, enValue });
  }
});

// Valida duplicações de faltas de traduções
const uniqueKeysMissingInPt = unique(missingInPt);
const uniqueKeysMissingInEn = unique(missingInEn);

// Logs informativos
console.warn("Traduções faltantes em PT:", uniqueKeysMissingInPt);
console.warn("Traduções faltantes em ES:", uniqueKeysMissingInEn);

// Se houver qualquer tradução faltante, lança erro
if (
  missingInPt.length > 0 ||
  missingInEn.length > 0
) {
  throw new Error("Existem traduções faltando em algum dos arquivos!");
}
