// 接收来自后台的消息
const blackList = '1688,aliexpress,wish,lazada,shopee,ebay,alibaba'
const loadingHtml = '<div class="loading"><i>Analysing</i><span></span><span></span><span></span><span></span><span></span></div>'
let loading = false
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', blackAndWhite);
} else {
  blackAndWhite();
}

// document.addEventListener('visibilitychange', tabChange);
chrome.runtime.onMessage.addListener(messageControl);

//消息通知控制
function messageControl (message) {
  const { type, value } = message
  if (type === 'black&white') {
    blackAndWhite()
  };
}

//黑白名单主要功能
async function blackAndWhite () {
  if (loading) {
    return
  }
  loading = true
  analysePopup("Black&White", '<div class="popup-bw">' + loadingHtml + '</div>')
  let list = {}
  const pageNode = document.querySelectorAll(".AaVjTc td")
  let urls = [];
  for (let i = 0; i < pageNode.length; i++) {
    const node = pageNode[i]
    const value = +node.innerText
    if (value && !isNaN(value) && value <= 3) {
      const href = node.childNodes[0].href
      urls.push({
        href,
        page: value
      })
    }
  }
  if (!urls.length) {
    urls.push({
      page: 1
    })
  }
  let length = urls.length
  for (let i = 0; i < length; i++) {
    if (i === 0) {
      const el = document.querySelector("body")
      blackAndWhiteCount(el, list)
    } else {
      let url = urls[i].href
      const html = await blackAndWhitePage(url)
      const el = document.createElement('div')
      el.innerHTML = html
      blackAndWhiteCount(el, list)
    }
  }
  const { black, white } = blackAndWhiteSort(list)
  blackAndWhiteShow(black, white)
}
//解析黑白名单dom
function blackAndWhiteCount (el, list) {
  const nodeList = $(el).find("#rso .g")
  let common = 'com,net,gov,org,xyz,top,tech,edu,ink,int,mil,pub,info,name,mobi,travel'
  common = common.split(',')
  nodeList.each(function () {
    let site = $(this).find('.TbwUpd .iUh30').text();
    site = site.split(/>|›/)
    site = site[0].replace(/\s+/g, '').toLowerCase() || ''
    let charts = site.split('.')
    let simple = ''
    charts.pop()
    charts.reverse()
    for(let chart of charts) {
      const isExt = common.some( item => item === chart)
      if(!isExt) {
        simple = chart
        break
      }
    }
    if (simple) {
      const isWhite = blackList.indexOf(simple) < 0
      if (!list[site] && isWhite) {
        list[site] = {
          type: 'white',
          count: 0
        }
        list[site].count += 1
      }
      if (!list[simple] && !isWhite) {
        list[simple] = {
          type: 'black',
          count: 0
        }
        list[simple].count += 1
      }
    }
  })
}
//获取黑白名单页面
function blackAndWhitePage (url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'text',
      contentType: 'application/json',
      success: res => {
        resolve(res)
      }, error: error => {
        reject(error)
      }
    });
  })
}
//获取黑白名单排序
function blackAndWhiteSort (list) {
  const keys = Object.keys(list)
  keys.sort((a, b) => list[b].count - list[a].count)
  const black = []
  const white = []
  keys.forEach(key => {
    const item = list[key]
    if (item.type === 'black') {
      black.push({
        site: key,
        count: item.count
      })
    }
    if (item.type === 'white') {
      white.push({
        site: key,
        count: item.count
      })
    }
  })
  return { black, white }
}
//黑白名单弹窗显示
function blackAndWhiteShow (black, white) {
  let blackHtml = ''
  let whiteHtml = ''
  const popupContent = document.querySelector('.getu-analyse-popup__content')
  black.forEach(item => {
    blackHtml += '<li><span>' + item.site + '</span><i>' + item.count + '</i></li>'
  })
  white.forEach(item => {
    whiteHtml += '<li><span>' + item.site + '</span><i>' + item.count + '</i></li>'
  })
  if (blackHtml) {
    blackHtml = '<p>黑名单</p><ul>' + blackHtml + '</ul>'
  }
  if (whiteHtml) {
    whiteHtml = '<p>白名单</p><ul>' + whiteHtml + '</ul>'
  }
  if (blackHtml || whiteHtml) {
    popupContent.innerHTML = '<div class="popup-bw">' + blackHtml + whiteHtml + '</div>'
  } else {
    popupContent.innerHTML = '<div class="popup-bw">No Result!</div>'
  }
  loading = false
}

//弹窗显示
function analysePopup (title, content) {
  const html = `<div class="getu-analyse-popup__group">
                  <h2 class="getu-analyse-popup__title">${title}</h2>
                  <div class="getu-analyse-popup__content">${content}</div>
                  <div class="getu-analyse-popup__close"></div>
                </div>
              `
  const popup = document.querySelector('.getu-analyse-popup')
  if(popup) {
    document.querySelector('.getu-analyse-popup__title').innerHTML = title
    document.querySelector('.getu-analyse-popup__content').innerHTML = content
    return
  }
  let ele = document.createElement('div');
  ele.className = 'getu-analyse-popup slideInRight';
  ele.style.top = 65 + 'px';
  ele.innerHTML = html;
  document.body.appendChild(ele);
  ele.classList.add('getu-analyse-popup__animated');
  const close = document.querySelector(".getu-analyse-popup__close")
  close.addEventListener('click', analysePopupHide)
}
//弹窗隐藏
function analysePopupHide (event) {
  event.target.removeEventListener("click", analysePopupHide)
  const popup = document.querySelector('.getu-analyse-popup')
  popup.style.top = '-100px';
  popup.remove()
}

//tab切换
// function tabChange () {
//   if (document.visibilityState === 'visible') {
//     clearAnalyse()
//   }
// }

