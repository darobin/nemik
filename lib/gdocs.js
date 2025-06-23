
import { google } from "googleapis";
import { googleAuth } from "./credentials.js";

export class GDocSource {
  #auth;
  #gdocs;
  async auth (service) {
    this.#auth = await googleAuth(service);
    this.#gdocs = google.docs({ version: "v1", auth: this.#auth });
  }
  async doc (src) {
    if (!this.#auth) throw new Error(`Need auth before you can get a doc.`);
    const res = await this.#gdocs.documents.get({ documentId: src, includeTabsContent: true });
    return res.data;
  }
}

export function toHTML (data) {

}

// {
//   "title": "A Democratic Internet",
//   "revisionId": "ALBJ4Ls6_WTadSIxTwj8ISC-ZCPoDhzEuVI0xHl5jpt-xay1ig_GletkY_SKjUS925oKF8OX_s5zo4TQ6wxUUg",
//   "suggestionsViewMode": "SUGGESTIONS_INLINE",
//   "documentId": "1NM8_Ww-Q6ER4hLgyrAtTrGINQouc1j-CleeDiCTA6A4",
//   "tabs": [
//     {
//       "tabProperties": {
//         "tabId": "t.0",
//         "title": "cover",
//         "index": 0
//       },
//       "documentTab": {
//         "body": {
//           "content": [
//             {
//               "endIndex": 1,
//               "sectionBreak": {
//                 "sectionStyle": {
//                   "columnSeparatorStyle": "NONE",
//                   "contentDirection": "LEFT_TO_RIGHT",
//                   "sectionType": "CONTINUOUS"
//                 }
//               }
//             },
//             {
//               "startIndex": 1,
//               "endIndex": 23,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 1,
//                     "endIndex": 23,
//                     "textRun": {
//                       "content": "A Democratic Internet\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "headingId": "h.2rgn12m8e7ic",
//                   "namedStyleType": "TITLE",
//                   "direction": "LEFT_TO_RIGHT"
//                 }
//               }
//             },
//             {
//               "startIndex": 23,
//               "endIndex": 24,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 23,
//                     "endIndex": 24,
//                     "textRun": {
//                       "content": "\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "direction": "LEFT_TO_RIGHT"
//                 }
//               }
//             }
//           ]
//         },
//         "documentStyle": {
//           "background": {
//             "color": {}
//           },
//           "pageNumberStart": 1,
//           "marginTop": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginBottom": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginRight": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginLeft": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "pageSize": {
//             "height": {
//               "magnitude": 841.8897637795277,
//               "unit": "PT"
//             },
//             "width": {
//               "magnitude": 595.2755905511812,
//               "unit": "PT"
//             }
//           },
//           "marginHeader": {
//             "magnitude": 36,
//             "unit": "PT"
//           },
//           "marginFooter": {
//             "magnitude": 36,
//             "unit": "PT"
//           },
//           "useCustomHeaderFooterMargins": true
//         },
//         "namedStyles": {
//           "styles": [
//             {
//               "namedStyleType": "NORMAL_TEXT",
//               "textStyle": {
//                 "bold": false,
//                 "italic": false,
//                 "underline": false,
//                 "strikethrough": false,
//                 "smallCaps": false,
//                 "backgroundColor": {},
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {}
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Proxima Nova",
//                   "weight": 400
//                 },
//                 "baselineOffset": "NONE"
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "alignment": "START",
//                 "lineSpacing": 115,
//                 "direction": "LEFT_TO_RIGHT",
//                 "spacingMode": "NEVER_COLLAPSE",
//                 "spaceAbove": {
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 10,
//                   "unit": "PT"
//                 },
//                 "borderBetween": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderTop": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderBottom": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderLeft": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderRight": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "indentFirstLine": {
//                   "unit": "PT"
//                 },
//                 "indentStart": {
//                   "unit": "PT"
//                 },
//                 "indentEnd": {
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": false,
//                 "keepWithNext": false,
//                 "avoidWidowAndOrphan": true,
//                 "shading": {
//                   "backgroundColor": {}
//                 },
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_1",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 20,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 20,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 6,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_2",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 200
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.mmq68xjggp1n",
//                 "namedStyleType": "HEADING_2",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 18,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 6,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "HEADING_3",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.2627451,
//                       "green": 0.2627451,
//                       "blue": 0.2627451
//                     }
//                   }
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 600
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.j461uvsxu54v",
//                 "namedStyleType": "HEADING_3",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "HEADING_4",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 14,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_5",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_6",
//               "textStyle": {
//                 "italic": true,
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "TITLE",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 26,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 200
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.qn6wqvd6l1st",
//                 "namedStyleType": "TITLE",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceBelow": {
//                   "magnitude": 3,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "SUBTITLE",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 15,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.p164h467bxwt",
//                 "namedStyleType": "SUBTITLE",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceBelow": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             }
//           ]
//         }
//       }
//     },
//     {
//       "tabProperties": {
//         "tabId": "t.m6mxnhskebh4",
//         "title": "Introduction",
//         "index": 1
//       },
//       "documentTab": {
//         "body": {
//           "content": [
//             {
//               "endIndex": 1,
//               "sectionBreak": {
//                 "sectionStyle": {
//                   "columnSeparatorStyle": "NONE",
//                   "contentDirection": "LEFT_TO_RIGHT",
//                   "sectionType": "CONTINUOUS"
//                 }
//               }
//             },
//             {
//               "startIndex": 1,
//               "endIndex": 7,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 1,
//                     "endIndex": 7,
//                     "textRun": {
//                       "content": "Notes\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "headingId": "h.o7w4b1nta9wi",
//                   "namedStyleType": "HEADING_2",
//                   "direction": "LEFT_TO_RIGHT"
//                 }
//               }
//             },
//             {
//               "startIndex": 7,
//               "endIndex": 148,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 7,
//                     "endIndex": 104,
//                     "textRun": {
//                       "content": "https://www.tandfonline.com/eprint/AWTRRABASNJ575YN4ISV/full?target=10.1080/17579961.2021.1977217",
//                       "textStyle": {
//                         "underline": true,
//                         "foregroundColor": {
//                           "color": {
//                             "rgbColor": {
//                               "red": 0.06666667,
//                               "green": 0.33333334,
//                               "blue": 0.8
//                             }
//                           }
//                         },
//                         "link": {
//                           "url": "https://www.tandfonline.com/eprint/AWTRRABASNJ575YN4ISV/full?target=10.1080/17579961.2021.1977217"
//                         }
//                       }
//                     }
//                   },
//                   {
//                     "startIndex": 104,
//                     "endIndex": 148,
//                     "textRun": {
//                       "content": " Diver on legitimate code and digisprudence\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "COLLAPSE_LISTS",
//                   "indentFirstLine": {
//                     "magnitude": 18,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 36,
//                     "unit": "PT"
//                   }
//                 },
//                 "bullet": {
//                   "listId": "kix.w0pxgm11vltq",
//                   "textStyle": {
//                     "underline": false,
//                     "baselineOffset": "NONE"
//                   }
//                 }
//               }
//             },
//             {
//               "startIndex": 148,
//               "endIndex": 243,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 148,
//                     "endIndex": 179,
//                     "textRun": {
//                       "content": "Code is more and less than law ",
//                       "textStyle": {}
//                     }
//                   },
//                   {
//                     "startIndex": 179,
//                     "endIndex": 241,
//                     "textRun": {
//                       "content": "https://cyber.jotwell.com/code-is-more-than-and-less-than-law/",
//                       "textStyle": {
//                         "underline": true,
//                         "foregroundColor": {
//                           "color": {
//                             "rgbColor": {
//                               "red": 0.06666667,
//                               "green": 0.33333334,
//                               "blue": 0.8
//                             }
//                           }
//                         },
//                         "link": {
//                           "url": "https://cyber.jotwell.com/code-is-more-than-and-less-than-law/"
//                         }
//                       }
//                     }
//                   },
//                   {
//                     "startIndex": 241,
//                     "endIndex": 243,
//                     "textRun": {
//                       "content": " \n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "COLLAPSE_LISTS",
//                   "indentFirstLine": {
//                     "magnitude": 18,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 36,
//                     "unit": "PT"
//                   }
//                 },
//                 "bullet": {
//                   "listId": "kix.w0pxgm11vltq",
//                   "textStyle": {
//                     "underline": false
//                   }
//                 }
//               }
//             }
//           ]
//         },
//         "documentStyle": {
//           "background": {
//             "color": {}
//           },
//           "pageNumberStart": 1,
//           "marginTop": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginBottom": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginRight": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginLeft": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "pageSize": {
//             "height": {
//               "magnitude": 841.8897637795277,
//               "unit": "PT"
//             },
//             "width": {
//               "magnitude": 595.2755905511812,
//               "unit": "PT"
//             }
//           },
//           "marginHeader": {
//             "magnitude": 36,
//             "unit": "PT"
//           },
//           "marginFooter": {
//             "magnitude": 36,
//             "unit": "PT"
//           },
//           "useCustomHeaderFooterMargins": true
//         },
//         "namedStyles": {
//           "styles": [
//             {
//               "namedStyleType": "NORMAL_TEXT",
//               "textStyle": {
//                 "bold": false,
//                 "italic": false,
//                 "underline": false,
//                 "strikethrough": false,
//                 "smallCaps": false,
//                 "backgroundColor": {},
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {}
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Proxima Nova",
//                   "weight": 400
//                 },
//                 "baselineOffset": "NONE"
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "alignment": "START",
//                 "lineSpacing": 115,
//                 "direction": "LEFT_TO_RIGHT",
//                 "spacingMode": "NEVER_COLLAPSE",
//                 "spaceAbove": {
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 10,
//                   "unit": "PT"
//                 },
//                 "borderBetween": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderTop": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderBottom": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderLeft": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderRight": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "indentFirstLine": {
//                   "unit": "PT"
//                 },
//                 "indentStart": {
//                   "unit": "PT"
//                 },
//                 "indentEnd": {
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": false,
//                 "keepWithNext": false,
//                 "avoidWidowAndOrphan": true,
//                 "shading": {
//                   "backgroundColor": {}
//                 },
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_1",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 20,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 20,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 6,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_2",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 200
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.mmq68xjggp1n",
//                 "namedStyleType": "HEADING_2",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 18,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 6,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "HEADING_3",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.2627451,
//                       "green": 0.2627451,
//                       "blue": 0.2627451
//                     }
//                   }
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 600
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.j461uvsxu54v",
//                 "namedStyleType": "HEADING_3",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "HEADING_4",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 14,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_5",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_6",
//               "textStyle": {
//                 "italic": true,
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "TITLE",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 26,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 200
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.qn6wqvd6l1st",
//                 "namedStyleType": "TITLE",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceBelow": {
//                   "magnitude": 3,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "SUBTITLE",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 15,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.p164h467bxwt",
//                 "namedStyleType": "SUBTITLE",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceBelow": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             }
//           ]
//         },
//         "lists": {
//           "kix.w0pxgm11vltq": {
//             "listProperties": {
//               "nestingLevels": [
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%0",
//                   "indentFirstLine": {
//                     "magnitude": 18,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 36,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%1",
//                   "indentFirstLine": {
//                     "magnitude": 54,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 72,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%2",
//                   "indentFirstLine": {
//                     "magnitude": 90,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 108,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%3",
//                   "indentFirstLine": {
//                     "magnitude": 126,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 144,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%4",
//                   "indentFirstLine": {
//                     "magnitude": 162,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 180,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%5",
//                   "indentFirstLine": {
//                     "magnitude": 198,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 216,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%6",
//                   "indentFirstLine": {
//                     "magnitude": 234,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 252,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%7",
//                   "indentFirstLine": {
//                     "magnitude": 270,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 288,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%8",
//                   "indentFirstLine": {
//                     "magnitude": 306,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 324,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 }
//               ]
//             }
//           }
//         }
//       }
//     },
//     {
//       "tabProperties": {
//         "tabId": "t.gcw3y0uv8lzc",
//         "title": "Power & Infrastructure",
//         "index": 2
//       },
//       "documentTab": {
//         "body": {
//           "content": [
//             {
//               "endIndex": 1,
//               "sectionBreak": {
//                 "sectionStyle": {
//                   "columnSeparatorStyle": "NONE",
//                   "contentDirection": "LEFT_TO_RIGHT",
//                   "sectionType": "CONTINUOUS"
//                 }
//               }
//             },
//             {
//               "startIndex": 1,
//               "endIndex": 24,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 1,
//                     "endIndex": 24,
//                     "textRun": {
//                       "content": "Power & Infrastructure\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "headingId": "h.u5lt84kd0cfc",
//                   "namedStyleType": "HEADING_1",
//                   "direction": "LEFT_TO_RIGHT"
//                 }
//               }
//             },
//             {
//               "startIndex": 24,
//               "endIndex": 25,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 24,
//                     "endIndex": 25,
//                     "textRun": {
//                       "content": "\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "direction": "LEFT_TO_RIGHT"
//                 }
//               }
//             },
//             {
//               "startIndex": 25,
//               "endIndex": 26,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 25,
//                     "endIndex": 26,
//                     "textRun": {
//                       "content": "\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "alignment": "START",
//                   "lineSpacing": 115,
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "NEVER_COLLAPSE",
//                   "spaceAbove": {
//                     "unit": "PT"
//                   },
//                   "spaceBelow": {
//                     "magnitude": 10,
//                     "unit": "PT"
//                   },
//                   "borderBetween": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderTop": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderBottom": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderLeft": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderRight": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "indentFirstLine": {
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "unit": "PT"
//                   },
//                   "indentEnd": {
//                     "unit": "PT"
//                   },
//                   "keepLinesTogether": false,
//                   "keepWithNext": false,
//                   "avoidWidowAndOrphan": true,
//                   "shading": {
//                     "backgroundColor": {}
//                   },
//                   "pageBreakBefore": false
//                 }
//               }
//             },
//             {
//               "startIndex": 26,
//               "endIndex": 27,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 26,
//                     "endIndex": 27,
//                     "textRun": {
//                       "content": "\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "alignment": "START",
//                   "lineSpacing": 115,
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "NEVER_COLLAPSE",
//                   "spaceAbove": {
//                     "unit": "PT"
//                   },
//                   "spaceBelow": {
//                     "magnitude": 10,
//                     "unit": "PT"
//                   },
//                   "borderBetween": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderTop": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderBottom": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderLeft": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderRight": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "indentFirstLine": {
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "unit": "PT"
//                   },
//                   "indentEnd": {
//                     "unit": "PT"
//                   },
//                   "keepLinesTogether": false,
//                   "keepWithNext": false,
//                   "avoidWidowAndOrphan": true,
//                   "shading": {
//                     "backgroundColor": {}
//                   },
//                   "pageBreakBefore": false
//                 }
//               }
//             },
//             {
//               "startIndex": 27,
//               "endIndex": 28,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 27,
//                     "endIndex": 28,
//                     "textRun": {
//                       "content": "\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "alignment": "START",
//                   "lineSpacing": 115,
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "NEVER_COLLAPSE",
//                   "spaceAbove": {
//                     "unit": "PT"
//                   },
//                   "spaceBelow": {
//                     "magnitude": 10,
//                     "unit": "PT"
//                   },
//                   "borderBetween": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderTop": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderBottom": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderLeft": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderRight": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "indentFirstLine": {
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "unit": "PT"
//                   },
//                   "indentEnd": {
//                     "unit": "PT"
//                   },
//                   "keepLinesTogether": false,
//                   "keepWithNext": false,
//                   "avoidWidowAndOrphan": true,
//                   "shading": {
//                     "backgroundColor": {}
//                   },
//                   "pageBreakBefore": false
//                 }
//               }
//             },
//             {
//               "startIndex": 28,
//               "endIndex": 30,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 28,
//                     "endIndex": 29,
//                     "horizontalRule": {
//                       "textStyle": {}
//                     }
//                   },
//                   {
//                     "startIndex": 29,
//                     "endIndex": 30,
//                     "textRun": {
//                       "content": "\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "alignment": "START",
//                   "lineSpacing": 115,
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "NEVER_COLLAPSE",
//                   "spaceAbove": {
//                     "unit": "PT"
//                   },
//                   "spaceBelow": {
//                     "magnitude": 10,
//                     "unit": "PT"
//                   },
//                   "borderBetween": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderTop": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderBottom": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderLeft": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderRight": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "indentFirstLine": {
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "unit": "PT"
//                   },
//                   "indentEnd": {
//                     "unit": "PT"
//                   },
//                   "keepLinesTogether": false,
//                   "keepWithNext": false,
//                   "avoidWidowAndOrphan": true,
//                   "shading": {
//                     "backgroundColor": {}
//                   },
//                   "pageBreakBefore": false
//                 }
//               }
//             },
//             {
//               "startIndex": 30,
//               "endIndex": 131,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 30,
//                     "endIndex": 131,
//                     "textRun": {
//                       "content": "Kill the idea that power is ultimately vested in a monopoly on violence (must be a source for this).\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "alignment": "START",
//                   "lineSpacing": 115,
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "COLLAPSE_LISTS",
//                   "spaceAbove": {
//                     "unit": "PT"
//                   },
//                   "spaceBelow": {
//                     "magnitude": 10,
//                     "unit": "PT"
//                   },
//                   "borderBetween": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderTop": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderBottom": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderLeft": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderRight": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "indentFirstLine": {
//                     "magnitude": 18,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 36,
//                     "unit": "PT"
//                   },
//                   "indentEnd": {
//                     "unit": "PT"
//                   },
//                   "keepLinesTogether": false,
//                   "keepWithNext": false,
//                   "avoidWidowAndOrphan": true,
//                   "shading": {
//                     "backgroundColor": {}
//                   },
//                   "pageBreakBefore": false
//                 },
//                 "bullet": {
//                   "listId": "kix.nf8qqe5tjfok",
//                   "textStyle": {
//                     "underline": false
//                   }
//                 }
//               }
//             },
//             {
//               "startIndex": 131,
//               "endIndex": 246,
//               "paragraph": {
//                 "elements": [
//                   {
//                     "startIndex": 131,
//                     "endIndex": 174,
//                     "textRun": {
//                       "content": "Susan Strange's theory of structural power ",
//                       "textStyle": {}
//                     }
//                   },
//                   {
//                     "startIndex": 174,
//                     "endIndex": 244,
//                     "textRun": {
//                       "content": "https://duckduckgo.com/?q=susan+strange+structural+power&t=fpas&ia=web",
//                       "textStyle": {
//                         "underline": true,
//                         "foregroundColor": {
//                           "color": {
//                             "rgbColor": {
//                               "red": 0.06666667,
//                               "green": 0.33333334,
//                               "blue": 0.8
//                             }
//                           }
//                         },
//                         "link": {
//                           "url": "https://duckduckgo.com/?q=susan+strange+structural+power&t=fpas&ia=web"
//                         }
//                       }
//                     }
//                   },
//                   {
//                     "startIndex": 244,
//                     "endIndex": 245,
//                     "textRun": {
//                       "content": " ",
//                       "textStyle": {}
//                     }
//                   },
//                   {
//                     "startIndex": 245,
//                     "endIndex": 246,
//                     "textRun": {
//                       "content": "\n",
//                       "textStyle": {}
//                     }
//                   }
//                 ],
//                 "paragraphStyle": {
//                   "namedStyleType": "NORMAL_TEXT",
//                   "alignment": "START",
//                   "lineSpacing": 115,
//                   "direction": "LEFT_TO_RIGHT",
//                   "spacingMode": "COLLAPSE_LISTS",
//                   "spaceAbove": {
//                     "unit": "PT"
//                   },
//                   "spaceBelow": {
//                     "magnitude": 10,
//                     "unit": "PT"
//                   },
//                   "borderBetween": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderTop": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderBottom": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderLeft": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "borderRight": {
//                     "color": {},
//                     "width": {
//                       "unit": "PT"
//                     },
//                     "padding": {
//                       "unit": "PT"
//                     },
//                     "dashStyle": "SOLID"
//                   },
//                   "indentFirstLine": {
//                     "magnitude": 18,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 36,
//                     "unit": "PT"
//                   },
//                   "indentEnd": {
//                     "unit": "PT"
//                   },
//                   "keepLinesTogether": false,
//                   "keepWithNext": false,
//                   "avoidWidowAndOrphan": true,
//                   "shading": {
//                     "backgroundColor": {}
//                   },
//                   "pageBreakBefore": false
//                 },
//                 "bullet": {
//                   "listId": "kix.nf8qqe5tjfok",
//                   "textStyle": {
//                     "underline": false
//                   }
//                 }
//               }
//             }
//           ]
//         },
//         "documentStyle": {
//           "background": {
//             "color": {}
//           },
//           "pageNumberStart": 1,
//           "marginTop": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginBottom": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginRight": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "marginLeft": {
//             "magnitude": 72,
//             "unit": "PT"
//           },
//           "pageSize": {
//             "height": {
//               "magnitude": 841.8897637795277,
//               "unit": "PT"
//             },
//             "width": {
//               "magnitude": 595.2755905511812,
//               "unit": "PT"
//             }
//           },
//           "marginHeader": {
//             "magnitude": 36,
//             "unit": "PT"
//           },
//           "marginFooter": {
//             "magnitude": 36,
//             "unit": "PT"
//           },
//           "useCustomHeaderFooterMargins": true
//         },
//         "namedStyles": {
//           "styles": [
//             {
//               "namedStyleType": "NORMAL_TEXT",
//               "textStyle": {
//                 "bold": false,
//                 "italic": false,
//                 "underline": false,
//                 "strikethrough": false,
//                 "smallCaps": false,
//                 "backgroundColor": {},
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {}
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Proxima Nova",
//                   "weight": 400
//                 },
//                 "baselineOffset": "NONE"
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "alignment": "START",
//                 "lineSpacing": 115,
//                 "direction": "LEFT_TO_RIGHT",
//                 "spacingMode": "NEVER_COLLAPSE",
//                 "spaceAbove": {
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 10,
//                   "unit": "PT"
//                 },
//                 "borderBetween": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderTop": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderBottom": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderLeft": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "borderRight": {
//                   "color": {},
//                   "width": {
//                     "unit": "PT"
//                   },
//                   "padding": {
//                     "unit": "PT"
//                   },
//                   "dashStyle": "SOLID"
//                 },
//                 "indentFirstLine": {
//                   "unit": "PT"
//                 },
//                 "indentStart": {
//                   "unit": "PT"
//                 },
//                 "indentEnd": {
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": false,
//                 "keepWithNext": false,
//                 "avoidWidowAndOrphan": true,
//                 "shading": {
//                   "backgroundColor": {}
//                 },
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_1",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 20,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 20,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 6,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_2",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 200
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.mmq68xjggp1n",
//                 "namedStyleType": "HEADING_2",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 18,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 6,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "HEADING_3",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.2627451,
//                       "green": 0.2627451,
//                       "blue": 0.2627451
//                     }
//                   }
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 600
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.j461uvsxu54v",
//                 "namedStyleType": "HEADING_3",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "HEADING_4",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 14,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_5",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "HEADING_6",
//               "textStyle": {
//                 "italic": true,
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 11,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "namedStyleType": "NORMAL_TEXT",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceAbove": {
//                   "magnitude": 12,
//                   "unit": "PT"
//                 },
//                 "spaceBelow": {
//                   "magnitude": 4,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true,
//                 "pageBreakBefore": false
//               }
//             },
//             {
//               "namedStyleType": "TITLE",
//               "textStyle": {
//                 "fontSize": {
//                   "magnitude": 26,
//                   "unit": "PT"
//                 },
//                 "weightedFontFamily": {
//                   "fontFamily": "Libre Franklin",
//                   "weight": 200
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.qn6wqvd6l1st",
//                 "namedStyleType": "TITLE",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceBelow": {
//                   "magnitude": 3,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             },
//             {
//               "namedStyleType": "SUBTITLE",
//               "textStyle": {
//                 "foregroundColor": {
//                   "color": {
//                     "rgbColor": {
//                       "red": 0.4,
//                       "green": 0.4,
//                       "blue": 0.4
//                     }
//                   }
//                 },
//                 "fontSize": {
//                   "magnitude": 15,
//                   "unit": "PT"
//                 }
//               },
//               "paragraphStyle": {
//                 "headingId": "h.p164h467bxwt",
//                 "namedStyleType": "SUBTITLE",
//                 "direction": "LEFT_TO_RIGHT",
//                 "spaceBelow": {
//                   "magnitude": 16,
//                   "unit": "PT"
//                 },
//                 "keepLinesTogether": true,
//                 "keepWithNext": true
//               }
//             }
//           ]
//         },
//         "lists": {
//           "kix.nf8qqe5tjfok": {
//             "listProperties": {
//               "nestingLevels": [
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%0",
//                   "indentFirstLine": {
//                     "magnitude": 18,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 36,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%1",
//                   "indentFirstLine": {
//                     "magnitude": 54,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 72,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%2",
//                   "indentFirstLine": {
//                     "magnitude": 90,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 108,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%3",
//                   "indentFirstLine": {
//                     "magnitude": 126,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 144,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%4",
//                   "indentFirstLine": {
//                     "magnitude": 162,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 180,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%5",
//                   "indentFirstLine": {
//                     "magnitude": 198,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 216,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%6",
//                   "indentFirstLine": {
//                     "magnitude": 234,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 252,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%7",
//                   "indentFirstLine": {
//                     "magnitude": 270,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 288,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 },
//                 {
//                   "bulletAlignment": "START",
//                   "glyphType": "GLYPH_TYPE_UNSPECIFIED",
//                   "glyphFormat": "%8",
//                   "indentFirstLine": {
//                     "magnitude": 306,
//                     "unit": "PT"
//                   },
//                   "indentStart": {
//                     "magnitude": 324,
//                     "unit": "PT"
//                   },
//                   "textStyle": {
//                     "underline": false
//                   },
//                   "startNumber": 1
//                 }
//               ]
//             }
//           }
//         }
//       }
//     }
//   ]
// }
