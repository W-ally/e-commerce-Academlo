



document.addEventListener('DOMContentLoaded', function () {
  darkTheme()
  headerScroll()
  navMenu()
  cartMenu()
  sectionActive()
  renderCart()
  renderProducts()
  activeProduct()

  mixitup('.products__content', {
    selectors: {
      target: '.products__card'
    },
    animation: {
      duration: 300
    }
  }).filter('all')
})

const items = [
    {
      id: 1,
      name: 'Hoodies',
      price: 14.00,
      image: 'assets/img/featured1.png',
      category: 'hoodies',
      quantity: 10
    },
    {
      id: 2,
      name: 'Shirts',
      price: 24.00,
      image: 'assets/img/featured2.png',
      category: 'shirts',
      quantity: 15
    },
    {
      id: 3,
      name: 'Sweatshirts',
      price: 24.00,
      image: 'assets/img/featured3.png',
      category: 'sweatshirts',
      quantity: 20
    }
  ]
  
/*start agree element
 */
function activeProduct () {
  const linksProducts = document.querySelectorAll('.products__item')

  for (let i = 0; i < linksProducts.length; i++) {
    linksProducts[i].addEventListener('click', function () {
      for (let j = 0; j < linksProducts.length; j++) {
        linksProducts[j].classList.remove('active-product')
      }
      this.classList.add('active-product')
    })
  }
}

function navMenu () {
  const navToggle = document.getElementById('nav-toggle')
  const navMenu = document.getElementById('nav-menu')
  const navClose = document.getElementById('nav-close')
  const navLink = document.querySelectorAll('.nav__link')

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('menu-s')
    })
  }

  if (navClose) {
    navClose.addEventListener('click', function () {
      navMenu.classList.remove('menu-s')
    })
  }

  function linkAction () {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('menu-s')
  }
  navLink.forEach(n => n.addEventListener('click', linkAction))
}

function numberToCurrency (value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}
const db = {
  items: window.localStorage.getItem('products') ? JSON.parse(window.localStorage.getItem('products')) : items,
  methods: {
    find: (id) => {
      return db.items.find(item => item.id === id)
    },
    getAll: () => {
      return db.items
    },
    remove: (items) => {
      items.forEach(item => {
        const product = db.methods.find(item.id)
        product.quantity = product.quantity - item.quantity
      })
    }
  }
}

export const renderProducts = () => {
  const productsContainer = document.querySelector('#products .products__content')
  const products = db.methods.getAll()
  let html = ''

  products.forEach(product => {
    html += `
      <article class="products__card ${product.category}">
      <div class="products__shape">
        <img src="${product.image}" alt="${product.name}" class="products__img">
      </div>

      <div class="products__data">
        <h2 class="products__price">${numberToCurrency(product.price)} <span class="products__quantity">| Stock: ${product.quantity}</span></h2>
        <h3 class="products__name">${product.name}</h3>

        <button class="button products__button" data-id="${product.id}">
          <i class='bx bx-plus'></i>
        </button>
      </div>
      </article>`
  })

  productsContainer.innerHTML += html

  const productsButton = document.querySelectorAll('.products__button')

  productsButton.forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'))
      const product = db.methods.find(id)

      if (product && product.quantity > 0) {
        cart.methods.add(id, 1)
        renderCart()
      } else {
        window.alert('Sorry, we are out of stock')
      }
    })
  })

  window.localStorage.setItem('products', JSON.stringify(db.items))
}
function sectionActive () {
  const sections = document.querySelectorAll('sct[id]')

  function fn() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight,
        sectionTop = current.offsetTop - 58,
        sectionId = current.getAttribute('id')

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector('.nv_display a[href*=' + sectionId + ']').classList.add('link-aa')
      } else {
        document.querySelector('.nv_display a[href*=' + sectionId + ']').classList.remove('link-aa')
      }
    })
  }

  window.addEventListener('scroll', fn)
}

const cart = {
    items: window.localStorage.getItem('cart') ? JSON.parse(window.localStorage.getItem('cart')) : [],
    methods: {
      add: (id, quantity) => {
        const cartItem = cart.methods.get(id)
  
        if (cartItem) {
          if (cart.methods.hasInventory(id, quantity + cartItem.quantity)) {
            cartItem.quantity += quantity
          } else {
            window.alert('We do not have enough in stock')
          }
        } else {
          cart.items.push({ id, quantity })
        }
      },
      remove: (id, quantity) => {
        const cartItem = cart.methods.get(id)
  
        if (cartItem.quantity - quantity > 0) {
          cartItem.quantity -= quantity
        } else {
          cart.items = cart.items.filter(item => item.id !== id)
        }
      },
      removeAll: (id) => {
        cart.items = cart.items.filter(item => item.id !== id)
      },
      count: () => {
        return cart.items.reduce((acc, item) => acc + item.quantity, 0)
      },
      get: (id) => {
        const index = cart.items.findIndex(item => item.id === id)
        return index >= 0 ? cart.items[index] : null
      },
      getAll: () => {
        return cart.items
      },
      getTotal: () => {
        const total = cart.items.reduce((acc, item) => {
          const itemDB = db.methods.find(item.id)
          return acc + (itemDB.price * item.quantity)
        }, 0)
  
        return total
      },
      hasInventory: (id, quantity) => {
        return db.methods.find(id).quantity - quantity >= 0
      },
      purchase: () => {
        db.methods.remove(cart.items)
        cart.items = []
      }
    }
  }
  
  export function renderCart () {
    const cartContainer = document.querySelector('#cart .cart__container')
    const cartItems = cart.methods.getAll()
    let html = ''
  
    if (cartItems.length > 0) {
      cartItems.forEach(item => {
        const product = db.methods.find(item.id)
        html += `
          <article class="cart__card">
            <div class="cart__box">
              <img src="${product.image}" alt="${product.name}" class="cart__img">
            </div>
    
            <div class="cart__details">
              <h3 class="cart__title">${product.name}</h3>
              <span class="cart__stock">Stock: ${product.quantity} | <span class="cart__price">${numberToCurrency(product.price)}</span></span>
              <span class="cart__subtotal">
                Subtotal: ${numberToCurrency(item.quantity * product.price)}
              </span>
    
              <div class="cart__amount">
                <div class="cart__amount-content">
                  <span class="cart__amount-box minus" data-id="${product.id}">
                  <i class='bx bx-minus'></i>
                  </span>
    
                  <span class="cart__amount-number">${item.quantity} units</span>
    
                  <span class="cart__amount-box plus" data-id="${product.id}">
                  <i class='bx bx-plus'></i>
                  </span>
                </div>
    
                <i class='bx bx-trash-alt cart__amount-trash' data-id="${product.id}"></i>
              </div>
            </div>
          </article>`
      })
    } else {
      html += `
        <div class="cart__empty">
          <img src="assets/img/empty-cart.png" alt="empty cart">
          <h2>Your cart is empty</h2>
          <p>You can add items to your cart by clicking on the "<i class="bx bx-plus"></i>" button on the product page.</p>
        </div>`
    }
  
    cartContainer.innerHTML = html
  
    const cartCount = document.getElementById('cart-count')
    const itemsCount = document.getElementById('items-count')
  
    cartCount.innerHTML = cart.methods.count()
    itemsCount.innerHTML = cart.methods.count()
  
    const minusItems = document.querySelectorAll('.minus')
    const plusItems = document.querySelectorAll('.plus')
    const deleteButtons = document.querySelectorAll('.cart__amount-trash')
    const totalContainer = document.getElementById('cart-total')
    const checkoutButton = document.getElementById('cart-checkout')
  
    minusItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.getAttribute('data-id'))
        cart.methods.remove(id, 1)
        renderCart()
      })
    })
  
    plusItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.getAttribute('data-id'))
        cart.methods.add(id, 1)
        renderCart()
      })
    })
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.getAttribute('data-id'))
        cart.methods.removeAll(id)
        renderCart()
      })
    })
  
    const total = cart.methods.getTotal()
    totalContainer.innerHTML = numberToCurrency(total)
  
    if (cart.items.length > 0) {
      checkoutButton.removeAttribute('disabled')
    } else {
      checkoutButton.setAttribute('disabled', 'disabled')
    }
  
    checkoutButton.addEventListener('click', () => {
      cart.methods.purchase()
      renderCart()
    })
  
    window.localStorage.setItem('products', JSON.stringify(db.items))
    window.localStorage.setItem('cart', JSON.stringify(cart.items))
  }
  function cartMenu () {
    const cartToggle = document.getElementById('cart-shop')
    const cart = document.getElementById('cart')
    const cartClose = document.getElementById('cart-close')
  
    if (cartToggle) {
      cartToggle.addEventListener('click', function () {
        cart.classList.toggle('show-cart')
      })
    }
  
    if (cartClose) {
      cartClose.addEventListener('click', function () {
        cart.classList.remove('show-cart')
      })
    }
  }
  function darkTheme () {
    const themeButton = document.getElementById('theme-button')
    const darkTheme = 'dark-theme'
    const iconTheme = 'bx-sun'
  
    const selectedTheme = window.localStorage.getItem('selected-theme')
    const selectedIcon = window.localStorage.getItem('selected-icon')
  
    const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
    const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun'
  
    if (selectedTheme) {
      document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
      themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme)
    }
  
    themeButton.addEventListener('click', () => {
      document.body.classList.toggle(darkTheme)
      themeButton.classList.toggle(iconTheme)
      window.localStorage.setItem('selected-theme', getCurrentTheme())
      window.localStorage.setItem('selected-icon', getCurrentIcon())
    })
  }  
  function headerScroll () {
    const header = document.getElementById('hdr')
  
    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY >= 50) {
          header.classList.add('scr-h')
        } else {
          header.classList.remove('scr-h')
        }
      })
    }
  }
  function load () {
    const load = document.getElementById('load')
    if (load) {
      setTimeout(() => {
        load.style.display = 'none'
      }, 3000)
    }
  }
    