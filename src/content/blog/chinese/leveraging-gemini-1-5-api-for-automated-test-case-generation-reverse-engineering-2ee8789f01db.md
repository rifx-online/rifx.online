---
title: "利用 Gemini 1.5 API 进行自动测试用例生成逆向工程"
meta_title: "利用 Gemini 1.5 API 进行自动测试用例生成逆向工程"
description: "该测试探索使用 Gemini API 和 Google Apps Script 自动创建示例输入，以便更快地进行脚本逆向工程。"
date: 2024-11-10T03:51:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fTtML3Sm1TuQNhQP.jpg"
categories: ["Programming", "Programming/Scripting", "Technology/WebAPI"]
author: "Rifx.Online"
tags: ["Gemini", "API", "automation", "reverse-engineering", "scripts"]
draft: False

---





## 摘要

本报告探讨了利用 Gemini 1.5 API 与 Google Apps Script 结合，自动化脚本逆向工程中的示例输入创建。传统上，这一过程是手动且耗时的，特别是对于具有大量测试用例的函数。通过将逆向工程技术应用于 Google Apps Script 示例，探讨了 Gemini 1.5 API 在自动化输入生成方面简化开发的潜力。

## 介绍

随着 Gemini 1\.5 API 的发布，用户获得了处理更复杂数据的能力，为各种应用开发打开了大门。本报告探讨了将 Gemini 1\.5 API 与 Google Apps Script 结合使用的潜力，以实现脚本开发和改进的逆向工程。

传统上，脚本开发涉及手动构建示例输入值。这个过程可能耗时，特别是在创建函数或测试从在线资源（如 Stack Overflow）获取的代码时。每个函数可能需要大量的测试用例，手动生成这些输入可能成为瓶颈。

Gemini 1\.5 API 提供了一个潜在的解决方案，通过自动化示例输入值的创建。这可以显著减少开发时间和精力。本报告通过将逆向工程技术应用于各种使用 Gemini 1\.5 API 的 Google Apps Script 示例，来调查这一可能性。

在这里，我们将探讨如何使用 Gemini 1\.5 API 自动化生成示例输入值，以进行编写在 Google Apps Script 中的脚本的逆向工程。

## 使用

为了测试此脚本，请按照以下流程进行。

## 1\. 创建 API 密钥

请访问 [https://ai.google.dev/gemini\-api/docs/api\-key](https://ai.google.dev/gemini-api/docs/api-key) 并创建您的 API 密钥。届时，请在 API 控制台启用生成语言 API。此 API 密钥用于此示例脚本。

该官方文档也可以查看。 [参考](https://ai.google.dev/)。

## 2\. 创建 Google Apps Script 项目

在本报告中，使用了 Google Apps Script。当然，本报告中介绍的方法也可以用于其他语言。

在这里，为了测试以下示例脚本，请创建一个独立的 Google Apps Script 项目。当然，此脚本也可以与容器绑定脚本一起使用。

请打开 Google Apps Script 项目的脚本编辑器。

## 3\. 安装 Google Apps Script 库

为了方便访问 Gemini API，我创建了一个 Google Apps Script 库 [GeminiWithFiles](https://github.com/tanaikech/GeminiWithFiles)。在以下示例脚本中，将使用该库。因此，请安装它。您可以在 [这里](https://github.com/tanaikech/GeminiWithFiles?tab=readme-ov-file#1-use-geminiwithfiles-as-a-google-apps-script-library) 查看安装方法。

## 4\. 示例脚本 1

示例函数选自 [我的代码库](https://github.com/tanaikech/UtlApp)。

* [transpose](https://github.com/tanaikech/UtlApp?tab=readme-ov-file#transpose): 转置二维数组。
* [removeDuplicatedValues](https://github.com/tanaikech/UtlApp?tab=readme-ov-file#removeduplicatedvalues): 从一维数组中移除重复值。
* [compilingNumbers](https://github.com/tanaikech/UtlApp?tab=readme-ov-file#compilingnumbers): 使用 Google Apps Script 编译连续数字。
* [unpivot](https://github.com/tanaikech/UtlApp?tab=readme-ov-file#unpivot): 将二维数组转换为非透视（反透视）。
* [expandA1Notations](https://github.com/tanaikech/UtlApp?tab=readme-ov-file#expanda1notations): 此方法用于扩展 A1 表示法。

下面提供了演示这些函数的示例脚本。在这个例子中，所有函数可以在一次 API 调用中执行。当我运行这个脚本时，它返回了总共 2,880 个令牌。

示例首先使用 Gemini 创建输入值。为了测试这些值，脚本随后将它们与在 Google Apps Script 中实现的函数一起使用。最后，输入和输出值都被打印出来。

这里使用 JSON 模式生成内容。这确保了 Gemini 稳定生成复杂的 JSON 对象。[参考](https://readmedium.com/taming-the-wild-output-effective-control-of-gemini-api-response-formats-with-response-mime-type-da273c08be85)因此，我选择在这个实例中使用它。

```python
function myFunction() {

  const apiKey = "###"; // Please set your API key.

  const functionObj = {
    transpose: function transpose(array) {
      /**
       * ### Description
       * When the inputted array is 2 dimensional array, true is returned.
       *
       * @param {Array} array 2 dimensional array.
       * @return {Boolean} When the inputted array is 2 dimensional array, true is returned.
       */
      function is2DimensionalArray(array) {
        return array.every((r) => Array.isArray(r));
      }

      /**
       * ### Description
       * Transpose 2 dimensional array.
       *
       * @param {Array} array 2 dimensional array.
       * @param {Boolean} check Check whether the inputted array is 2 dimensional array. Default is true.
       * @return {Array} Transposed array.
       */
      function transpose(array, check = true) {
        if (check && !is2DimensionalArray(array)) {
          throw new Error("Please use 2 dimensional array.");
        }
        return array[0].map((_, col) => array.map((row) => row[col] || null));
      }
      return transpose(array);
    },
    removeDuplicatedValues: function removeDuplicatedValues(array) {
      /**
       * ### Description
       * Remove duplicated values from 1 dimensional array.
       *
       * @param {Array} array 1 dimensional array.
       * @return {Object} Object including removeDuplicatedValues, duplicatedValues and numberOfDuplicate.
       */
      function removeDuplicatedValues(array) {
        if (!Array.isArray(array)) {
          throw new Error("Please use 1 dimensional array.");
        }
        const obj = array.reduce(
          (m, e) => m.set(e, m.has(e) ? m.get(e) + 1 : 1),
          new Map()
        );
        const e = [...obj.entries()];
        return {
          removeDuplicatedValues: [...obj.keys()],
          duplicatedValues: e.reduce((ar, [k, v]) => {
            if (v != 1) ar.push(k);
            return ar;
          }, []),
          numberOfDuplicate: Object.fromEntries(e),
        };
      }
      return removeDuplicatedValues(array);
    },
    compilingNumbers: function compilingNumbers(array) {
      /**
       * ### Description
       * Compiling Continuous Numbers using Google Apps Script.
       *
       * @param {Array} array Input array.
       * @return {Array} Array including object like [{"start":1,"end":1},{"start":3,"end":5},{"start":7,"end":7},{"start":9,"end":11},{"start":13,"end":13}].
       */
      function compilingNumbers(array) {
        if (!(Array.isArray(array) && array.every((e) => !isNaN(e)))) {
          throw new Error("Please give an array including numbers.");
        }
        const { values } = [...new Set(array.sort((a, b) => a - b))].reduce(
          (o, e, i, a) => {
            if (
              o.temp.length == 0 ||
              (o.temp.length > 0 && e == o.temp[o.temp.length - 1] + 1)
            ) {
              o.temp.push(e);
            } else {
              if (o.temp.length > 0) {
                o.values.push({
                  start: o.temp[0],
                  end: o.temp[o.temp.length - 1],
                });
              }
              o.temp = [e];
            }
            if (i == a.length - 1) {
              o.values.push(
                o.temp.length > 1
                  ? { start: o.temp[0], end: o.temp[o.temp.length - 1] }
                  : { start: e, end: e }
              );
            }
            return o;
          },
          { temp: [], values: [] }
        );
        return values;
      }
      return compilingNumbers(array);
    },
    unpivot: function unpivot(values) {
      /**
       * ### Description
       * When the inputted array is 2 dimensional array, true is returned.
       *
       * @param {Array} array 2 dimensional array.
       * @return {Boolean} When the inputted array is 2 dimensional array, true is returned.
       */
      function is2DimensionalArray(array) {
        return array.every((r) => Array.isArray(r));
      }

      /**
       * ### Description
       * Converting 2-dimensional array as unpivot (reverse pivot).
       *
       * @param {Array} values 2 dimensional array.
       * @return {Array} 2 dimensional array converted as unpivot (reverse pivot).
       */
      function unpivot(values) {
        if (!Array.isArray(values) || !is2DimensionalArray(values)) {
          throw new Error("Please give an array of values.");
        }
        const [[, ...h], ...v] = values;
        return h.flatMap((hh, i) => v.map((t) => [hh, t[0], t[i + 1]]));
      }
      return unpivot(values);
    },
    expandA1Notations: function expandA1Notations(a1Notations) {
      /**
       * ### Description
       * Converting colum letter to column index. Start of column index is 0.
       * @param {String} letter Column letter.
       * @return {Number} Column index.
       */
      function columnLetterToIndex(letter = null) {
        if (letter === null || typeof letter != "string") {
          throw new Error("Please give the column letter as a string.");
        }
        letter = letter.toUpperCase();
        return [...letter].reduce(
          (c, e, i, a) =>
            (c += (e.charCodeAt(0) - 64) * Math.pow(26, a.length - i - 1)),
          -1
        );
      }

      /**
       * ### Description
       * Converting colum index to column letter. Start of column index is 0.
       * Ref: https://stackoverflow.com/a/53678158/7108653
       * @param {Number} index Column index.
       * @return {String} Column letter.
       */
      function columnIndexToLetter(index = null) {
        if (index === null || isNaN(index)) {
          throw new Error(
            "Please give the column indexr as a number. In this case, 1st number is 0."
          );
        }
        return (a = Math.floor(index / 26)) >= 0
          ? columnIndexToLetter(a - 1) + String.fromCharCode(65 + (index % 26))
          : "";
      }

      /**
       * ### Description
       * This method is used for expanding A1Notations.
       * @param {Array} a1Notations Array including A1Notations.
       * @return {Array} Array including the expanded A1Notations.
       */
      function expandA1Notations(a1Notations, maxRow = "10", maxColumn = "Z") {
        if (!Array.isArray(a1Notations) || a1Notations.length == 0) {
          throw new Error("Please give a1Notations (Array).");
        }
        const reg1 = new RegExp("^([A-Z]+)([0-9]+)$");
        const reg2 = new RegExp("^([A-Z]+)$");
        const reg3 = new RegExp("^([0-9]+)$");
        return a1Notations.map((e) => {
          const a1 = e.split("!");
          const r = a1.length > 1 ? a1[1] : a1[0];
          const [r1, r2] = r.split(":");
          if (!r2) return [r1];
          let rr;
          if (reg1.test(r1) && reg1.test(r2)) {
            rr = [r1.toUpperCase().match(reg1), r2.toUpperCase().match(reg1)];
          } else if (reg2.test(r1) && reg2.test(r2)) {
            rr = [
              [null, r1, 1],
              [null, r2, maxRow],
            ];
          } else if (reg1.test(r1) && reg2.test(r2)) {
            rr = [r1.toUpperCase().match(reg1), [null, r2, maxRow]];
          } else if (reg2.test(r1) && reg1.test(r2)) {
            rr = [[null, r1, maxRow], r2.toUpperCase().match(reg1)];
          } else if (reg3.test(r1) && reg3.test(r2)) {
            rr =
              Number(r1) > Number(r2)
                ? [
                    [null, "A", r2],
                    [null, maxColumn, r1],
                  ]
                : [
                    [null, "A", r1],
                    [null, maxColumn, r2],
                  ];
          } else if (reg1.test(r1) && reg3.test(r2)) {
            rr = [r1.toUpperCase().match(reg1), [null, maxColumn, r2]];
          } else if (reg3.test(r1) && reg1.test(r2)) {
            let temp = r2.toUpperCase().match(reg1);
            rr =
              Number(temp[2]) > Number(r1)
                ? [
                    [null, temp[1], r1],
                    [null, maxColumn, temp[2]],
                  ]
                : [temp, [null, maxColumn, r1]];
          } else {
            throw new Error("Wrong a1Notation: " + r);
          }
          const obj = {
            startRowIndex: Number(rr[0][2]),
            endRowIndex:
              rr.length == 1 ? Number(rr[0][2]) + 1 : Number(rr[1][2]) + 1,
            startColumnIndex: columnLetterToIndex(rr[0][1]),
            endColumnIndex:
              rr.length == 1
                ? columnLetterToIndex(rr[0][1]) + 1
                : columnLetterToIndex(rr[1][1]) + 1,
          };
          let temp = [];
          for (let i = obj.startRowIndex; i < obj.endRowIndex; i++) {
            for (let j = obj.startColumnIndex; j < obj.endColumnIndex; j++) {
              temp.push(columnIndexToLetter(j) + i);
            }
          }
          return temp;
        });
      }
      return expandA1Notations(a1Notations);
    },
  };

  const g = GeminiWithFiles.geminiWithFiles({
    apiKey,
    response_mime_type: "application/json",
    doCountToken: true,
  });

  const functions = Object.entries(functionObj)
    .map(
      ([k, v]) =>
        `<FunctionName>${k}</FunctionName><Function>${v.toString()}</Function>`
    )
    .join("");
  const jsonSchema = {
    title: "5 input values for giving each function",
    description: `Proposal 5 input values for giving each function. ${functions} Don't propose "empty", "null", "undefined" as values.`,
    type: "array",
    items: {
      type: "object",
      properties: {
        functionName: { description: "Function name", type: "string" },
        inputValues: {
          description: `Proposed 5 input values. Don't propose "empty", "null", "undefined" as values.`,
          type: "array",
          items: {
            description: "Proposed input value",
            type: "array|object|string|number",
          },
        },
      },
      additionalProperties: false,
    },
  };
  let res = g.generateContent({ jsonSchema });
  if (typeof res == "string") {
    try {
      res = JSON.parse(res);
    } catch ({ stack }) {
      console.error(stack);
      return;
    }
  }
  const result = res.reduce((o, { functionName, inputValues }) => {
    try {
      o[functionName] = [];
      inputValues.forEach((input) => {
        const output = functionObj[functionName](input);
        o[functionName].push({ input, output });
      });
    } catch ({ stack }) {
      console.log(stack);
    }
    return o;
  }, {});
  console.log(JSON.stringify(result));
}
```
运行此脚本后，获得以下结果。可以看到有效的输入和输出值已被创建。

```python
{
  "transpose": [
    { "input": [[1, 2], [3, 4]], "output": [[1, 3], [2, 4]] },
    { "input": [["a", "b"], ["c", "d"]], "output": [["a", "c"], ["b", "d"]] },
    { "input": [["a1", "b1"], ["c1", "d1"], ["e1", "f1"]], "output": [["a1", "c1", "e1"], ["b1", "d1", "f1"]] },
    { "input": [[true, false], [false, true]], "output": [[true, null], [null, true]] },
    { "input": [[1, "a"], ["c", true]], "output": [[1, "c"], ["a", true]] }
  ],

  "removeDuplicatedValues": [
    { "input": [1, 2, 3, 4, 5], "output": { "removeDuplicatedValues": [1, 2, 3, 4, 5], "duplicatedValues": [], "numberOfDuplicate": { "1": 1, "2": 1, "3": 1, "4": 1, "5": 1 } } },
    { "input": ["a", "b", "c", "d", "e"], "output": { "removeDuplicatedValues": ["a", "b", "c", "d", "e"], "duplicatedValues": [], "numberOfDuplicate": { "a": 1, "b": 1, "c": 1, "d": 1, "e": 1 } } },
    { "input": [1, 2, 1, 3, 2, 4, 3, 5, 4], "output": { "removeDuplicatedValues": [1, 2, 3, 4, 5], "duplicatedValues": [1, 2, 3, 4], "numberOfDuplicate": { "1": 2, "2": 2, "3": 2, "4": 2, "5": 1 } } },
    { "input": ["a", "b", "a", "c", "b", "d", "c", "e", "d"], "output": { "removeDuplicatedValues": ["a", "b", "c", "d", "e"], "duplicatedValues": ["a", "b", "c", "d"], "numberOfDuplicate": { "a": 2, "b": 2, "c": 2, "d": 2, "e": 1 } } },
    { "input": [1, "a", 2, "b", 1, "c", 2, "d", 1, "e"], "output": { "removeDuplicatedValues": [1, "a", 2, "b", "c", "d", "e"], "duplicatedValues": [1, 2], "numberOfDuplicate": { "1": 3, "2": 2, "a": 1, "b": 1, "c": 1, "d": 1, "e": 1 } } }
  ],

  "compilingNumbers": [
    { "input": [1, 2, 3, 4, 5], "output": [{ "start": 1, "end": 5 }] },
    { "input": [1, 3, 5, 7, 9, 11, 13], "output": [{ "start": 1, "end": 1 }, { "start": 3, "end": 3 }, { "start": 5, "end": 5 }, { "start": 7, "end": 7 }, { "start": 9, "end": 9 }, { "start": 11, "end": 11 }, { "start": 13, "end": 13 }] },
    { "input": [1, 3, 5, 7, 8, 10, 12, 13], "output": [{ "start": 1, "end": 1 }, { "start": 3, "end": 3 }, { "start": 5, "end": 5 }, { "start": 7, "end": 8 }, { "start": 10, "end": 10 }, { "start": 12, "end": 13 }] },
    { "input": [1, 2, 4, 5, 7, 8, 10, 11, 13, 14], "output": [{ "start": 1, "end": 2 }, { "start": 4, "end": 5 }, { "start": 7, "end": 8 }, { "start": 10, "end": 11 }, { "start": 13, "end": 14 }] },
    { "input": [1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15], "output": [{ "start": 1, "end": 3 }, { "start": 5, "end": 6 }, { "start": 8, "end": 9 }, { "start": 11, "end": 12 }, { "start": 14, "end": 15 }] }
  ],

  "unpivot": [
    { "input": [["name", "score1", "score2"], ["sample1", 100, 80], ["sample2", 90, 70]], "output": [["score1", "sample1", 100], ["score1", "sample2", 90], ["score2", "sample1", 80], ["score2", "sample2", 70]] },
    { "input": [["name", "score1", "score2", "score3"], ["sample1", 100, 80, 70], ["sample2", 90, 70, 80]], "output": [["score1", "sample1", 100], ["score1", "sample2", 90], ["score2", "sample1", 80], ["score2", "sample2", 70], ["score3", "sample1", 70], ["score3", "sample2", 80]] },
    { "input": [["id", "x", "y", "z"], ["a", 1, 2, 3], ["b", 4, 5, 6]], "output": [["x", "a", 1], ["x", "b", 4], ["y", "a", 2], ["y", "b", 5], ["z", "a", 3], ["z", "b", 6]] },
    { "input": [["id", "x", "y", "z", "xx", "yy", "zz"], ["a", 1, 2, 3, 10, 20, 30], ["b", 4, 5, 6, 40, 50, 60]], "output": [["x", "a", 1], ["x", "b", 4], ["y", "a", 2], ["y", "b", 5], ["z", "a", 3], ["z", "b", 6], ["xx", "a", 10], ["xx", "b", 40], ["yy", "a", 20], ["yy", "b", 50], ["zz", "a", 30], ["zz", "b", 60]] },
    { "input": [["Fruit", "2021", "2022", "2023"], ["apple", 100, 120, 150], ["orange", 80, 90, 100]], "output": [["2021", "apple", 100], ["2021", "orange", 80], ["2022", "apple", 120], ["2022", "orange", 90], ["2023", "apple", 150], ["2023", "orange", 100]] }
  ],

  "expandA1Notations": [
    { "input": ["A1:B5", "C3:D7", "E2:F10"], "output": [["A1", "B1", "A2", "B2", "A3", "B3", "A4", "B4", "A5", "B5"], ["C3", "D3", "C4", "D4", "C5", "D5", "C6", "D6", "C7", "D7"], ["E2", "F2", "E3", "F3", "E4", "F4", "E5", "F5", "E6", "F6", "E7", "F7", "E8", "F8", "E9", "F9", "E10", "F10"]] },
    { "input": ["A:B", "C:D", "E:F"], "output": [["A1", "B1", "A2", "B2", "A3", "B3", "A4", "B4", "A5", "B5", "A6", "B6", "A7", "B7", "A8", "B8", "A9", "B9", "A10", "B10"], ["C1", "D1", "C2", "D2", "C3", "D3", "C4", "D4", "C5", "D5", "C6", "D6", "C7", "D7", "C8", "D8", "C9", "D9", "C10", "D10"], ["E1", "F1", "E2", "F2", "E3", "F3", "E4", "F4", "E5", "F5", "E6", "F6", "E7", "F7", "E8", "F8", "E9", "F9", "E10", "F10"]] },
    { "input": ["A1:C5"], "output": [["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3", "A4", "B4", "C4", "A5", "B5", "C5"]] },
    { "input": ["A:C"], "output": [["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3", "A4", "B4", "C4", "A5", "B5", "C5", "A6", "B6", "C6", "A7", "B7", "C7", "A8", "B8", "C8", "A9", "B9", "C9", "A10", "B10", "C10"]] },
    { "input": ["1:5", "3:7", "2:10"], "output": [["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1", "A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2", "L2", "M2", "N2", "O2", "P2", "Q2", "R2", "S2", "T2", "U2", "V2", "W2", "X2", "Y2", "Z2", "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3", "L3", "M3", "N3", "O3", "P3", "Q3", "R3", "S3", "T3", "U3", "V3", "W3", "X3", "Y3", "Z3", "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4", "L4", "M4", "N4", "O4", "P4", "Q4", "R4", "S4", "T4", "U4", "V4", "W4", "X4", "Y4", "Z4", "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5", "L5", "M5", "N5", "O5", "P5", "Q5", "R5", "S5", "T5", "U5", "V5", "W5", "X5", "Y5", "Z5"], ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3", "L3", "M3", "N3", "O3", "P3", "Q3", "R3", "S3", "T3", "U3", "V3", "W3", "X3", "Y3", "Z3", "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4", "L4", "M4", "N4", "O4", "P4", "Q4", "R4", "S4", "T4", "U4", "V4", "W4", "X4", "Y4", "Z4", "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5", "L5", "M5", "N5", "O5", "P5", "Q5", "R5", "S5", "T5", "U5", "V5", "W5", "X5", "Y5", "Z5", "A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6", "K6", "L6", "M6", "N6", "O6", "P6", "Q6", "R6", "S6", "T6", "U6", "V6", "W6", "X6", "Y6", "Z6", "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7", "K7", "L7", "M7", "N7", "O7", "P7", "Q7", "R7", "S7", "T7", "U7", "V7", "W7", "X7", "Y7", "Z7"], ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2", "L2", "M2", "N2", "O2", "P2", "Q2", "R2", "S2", "T2", "U2", "V2", "W2", "X2", "Y2", "Z2", "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3", "L3", "M3", "N3", "O3", "P3", "Q3", "R3", "S3", "T3", "U3", "V3", "W3", "X3", "Y3", "Z3", "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4", "L4", "M4", "N4", "O4", "P4", "Q4", "R4", "S4", "T4", "U4", "V4", "W4", "X4", "Y4", "Z4", "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5", "L5", "M5", "N5", "O5", "P5", "Q5", "R5", "S5", "T5", "U5", "V5", "W5", "X5", "Y5", "Z5", "A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6", "K6", "L6", "M6", "N6", "O6", "P6", "Q6", "R6", "S6", "T6", "U6", "V6", "W6", "X6", "Y6", "Z6", "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7", "K7", "L7", "M7", "N7", "O7", "P7", "Q7", "R7", "S7", "T7", "U7", "V7", "W7", "X7", "Y7", "Z7", "A8", "B8", "C8", "D8", "E8", "F8", "G8", "H8", "I8", "J8", "K8", "L8", "M8", "N8", "O8", "P8", "Q8", "R8", "S8", "T8", "U8", "V8", "W8", "X8", "Y8", "Z8", "A9", "B9", "C9", "D9", "E9", "F9", "G9", "H9", "I9", "J9", "K9", "L9", "M9", "N9", "O9", "P9", "Q9", "R9", "S9", "T9", "U9", "V9", "W9", "X9", "Y9", "Z9", "A10", "B10", "C10", "D10", "E10", "F10", "G10", "H10", "I10", "J10", "K10", "L10", "M10", "N10", "O10", "P10", "Q10", "R10", "S10", "T10", "U10", "V10", "W10", "X10", "Y10", "Z10"]] }
  ]
}
```

## 5\. 示例脚本 2

上述示例脚本的每个函数仅使用一个参数。当使用多个参数时，脚本如下。示例函数如下。

* [splitArray](https://github.com/tanaikech/UtlApp?tab=readme-ov-file#splitarray): 每 n 长度拆分数组。


```python
function myFunction() {

  const apiKey = "###"; // Please set your API key.

  const functionObj = {
    splitArray: function splitArray(array, size) {
      /**
       * ### Description
       * Split array every n length.
       *
       * @param {Array} array 2 dimensional array.
       * @param {Boolean} check Check whether the inputted array is 2 dimensional array. Default is true.
       * @return {Array} Transposed array.
       */
      function splitArray(array, size) {
        if (!array || !size || !Array.isArray(array)) {
          throw new Error("Please give an array and split size.");
        }
        return [...Array(Math.ceil(array.length / size))].map((_) =>
          array.splice(0, size)
        );
      }
      return splitArray(array, size);
    },
  };

  const g = GeminiWithFiles.geminiWithFiles({
    apiKey,
    response_mime_type: "application/json",
    doCountToken: true,
  });

  const functions = Object.entries(functionObj)
    .map(
      ([k, v]) =>
        `<FunctionName>${k}</FunctionName><Function>${v.toString()}</Function>`
    )
    .join("");
  const jsonSchema = {
    title: "5 input values for giving each function",
    description: `Proposal 5 input values for giving each function. ${functions} Don't propose "empty", "null", "undefined" as values.`,
    type: "array",
    items: {
      type: "object",
      properties: {
        functionName: { description: "Function name", type: "string" },
        inputValues: {
          description: `Proposed 5 input values. Don't propose "empty", "null", "undefined" as values.`,
          type: "array",
          items: {
            description: "Proposed input value",
            type: "array|object|string|number",
          },
        },
      },
      additionalProperties: false,
    },
  };
  let res = g.generateContent({ jsonSchema });
  if (typeof res == "string") {
    try {
      res = JSON.parse(res);
    } catch ({ stack }) {
      console.error(stack);
      return;
    }
  }
  const result = res.reduce((o, { functionName, inputValues }) => {
    try {
      o[functionName] = [];
      inputValues.forEach((input) => {
        const temp = JSON.parse(JSON.stringify(input));
        const output = functionObj[functionName](...temp);
        o[functionName].push({ input, output });
      });
    } catch ({ stack }) {
      console.log(stack);
    }
    return o;
  }, {});
  console.log(JSON.stringify(result));
}
```
运行此脚本时，将获得以下结果。


```python
{
  "splitArray": [
    { "input": [[1, 2, 3, 4, 5, 6], 2], "output": [[1, 2], [3, 4], [5, 6]] },
    { "input": [["a", "b", "c", "d", "e"], 2], "output": [["a", "b"], ["c", "d"], ["e"]] },
    { "input": [["apple", "orange", "grape", "banana", "kiwi"], 3], "output": [["apple", "orange", "grape"], ["banana", "kiwi"]] },
    { "input": [[true, false, true, false, true], 1], "output": [[true], [false], [true], [false], [true]] },
    { "input": [[1.2, 3.14, 2.71, 0.577], 2], "output": [[1.2, 3.14], [2.71, 0.577]] }
  ]
}
```

## 摘要

从上述结果来看，我们可以确认使用 Gemini API 进行逆向工程的可能性。这也表明 Gemini API 可以用于开发应用程序。

## 注意

* 如果发生错误，请再次运行脚本。或者，请调整 JSON 架构中的描述。
* 我相信这种方法也可以用于除 Google Apps Script 之外的其他语言。
* 在当前阶段，似乎依赖于 Google Apps Script 的类对象，如 SpreadsheetApp、DriveApp 等，无法用作输入值。
* 顶部的抽象图像是由 [Gemini](https://gemini.google.com/app) 创建的。

