import React from 'react';
import PropTypes from 'prop-types';

const staticStyle = {
  position: 'relative',
  // position: 'static',
};


class Item {

  constructor(item = null, parent = null, level = -1) {
    this.item = item;
    this.parent = parent;
    this.level = level;
    if (this.parent) {
      this.parent.children.push(this);
    }
    this.children = [];
  }

  print(ident = '') {
    for (let child of this.children) {
      child.print(ident + '  ');
    }
  }
}


function detectFixeds(parent, fixedItens, top = window.pageYOffset + 0, lastFixedHeight = 0, context = {
  lastFixed: undefined,
}) {
  const parentOffsetHeight = parent.item ? parent.item.offsetHeight() : 0;
  const height = parentOffsetHeight + lastFixedHeight;

  for (let item of parent.children) {
    const itemOffsetTop = item.item.offsetTop();
    console.log('itemOffsetTop', itemOffsetTop)
    item.height = height;

    if (itemOffsetTop <= (top + height)) {
      item.fixed = true;

      fixedItens.push(item);
      context.lastFixed = item;
      parent.fixedChildren = item;

      detectFixeds(item, fixedItens, top, height, context);
      parent.heightWithChildren = item.heightWithChildren + parentOffsetHeight;
    } else {
      while (context.lastFixed && itemOffsetTop <= (top + context.lastFixed.height)) {
        context.lastFixed.fixed = false;
        context.lastFixed.parent.fixedChildren = undefined;
        context.lastFixed = fixedItens.pop();
      }
    }
  }
}

function createStyle(styles, item) {
  let level = item.level;
  let registrationId = item.item.registrationId;
  let style = item.style;

  if (!styles[level]) {
    styles[level] = [];
  }
  let changed = styles[level][registrationId] !== style;
  styles[level][registrationId] = style;
  return changed;
}

function initializeItemStyle(parent, createStylesConf, initialHeight = 0) {
  let height = parent.item ? (parent.item.offsetHeight() + initialHeight) : 0;

  for (let item of parent.children) {

    if (!item.styleStatic) {
      let newStaticStyle = staticStyle;
      let zIndex = createStylesConf.lastZIndex++;
      newStaticStyle = Object.assign({
        zIndex,
      }, staticStyle);
      item.styleStatic = newStaticStyle;
    }

    initializeItemStyle(item, createStylesConf, height);

    if (!item.styleFixed) {
      let extraStyle = createStylesConf.getFixedExtraStyle(item.level, createStylesConf.identationDistance);
      let zIndex = createStylesConf.lastZIndex++;
      let style = Object.assign(
        {
          position: 'fixed',
          top: height,
          width: `calc(100% - ${item.level * createStylesConf.identationDistance}px)`,
          zIndex,
        },
        extraStyle
      );
      item.styleFixed = style;
    }
  }
}

function createStyles(parent, createStylesConf) {
  if (parent.fixedChildren) {
    /**
     * @type Item
     */
    let itemFixed = parent.fixedChildren;

    createStyles(itemFixed, createStylesConf);

    if (itemFixed.style !== itemFixed.styleFixed) {
      itemFixed.style = itemFixed.styleFixed;
      if (createStyle(createStylesConf.styles, itemFixed)) {
        itemFixed.item.component.forceUpdate();
      }
    }


    for (let item of parent.children) {
      if (item !== itemFixed) {

        item.fixedChildren = undefined;
        createStyles(item, createStylesConf);

        if (item.style !== item.styleStatic) {
          item.style = item.styleStatic;
          if (createStyle(createStylesConf.styles, item)) {
            item.item.component.forceUpdate();
          }
        }
      }
    }
  } else {
    for (let item of parent.children) {
      item.fixedChildren = undefined;
      createStyles(item, createStylesConf);

      if (item.style !== item.styleStatic) {
        item.style = item.styleStatic;
        if (createStyle(createStylesConf.styles, item)) {
          item.item.component.forceUpdate();
        }
      }
    }
  }
}

function clearFixedStates(allItens) {
  for (let item of allItens) {
    item.fixed = false;
    item.fixedChildren = undefined;
  }
}

function __calculateStyles(contexto, cellUp, preFixedItems) {
  console.log('contexto', contexto);
  let cache = contexto.cache;

  let root = cache.root;

  if (root === null) {
    root = new Item();
    cache.root = root;
    cache.allItens = [ root ];

    let itemsOfPreviousLevel = [];
    contexto.components.forEach((levelItems, level) => {
      if (level === 0) {

        levelItems.forEach((item, registrationId) => {
          let item_ = new Item(item, root, level);
          cache.allItens.push(item_);
          itemsOfPreviousLevel.push(item_);
        });
      } else {
        let createdItemsInThisLevel = [];

        levelItems.forEach((item) => {
          const itemOffsetTop = item.offsetTop();
          let previous;
          for (let itemOfPreviousLevel of itemsOfPreviousLevel) {
            console.log(itemOffsetTop, itemOfPreviousLevel.item.offsetTop());
            if (itemOffsetTop < itemOfPreviousLevel.item.offsetTop()) {
              break;
            }
            previous = itemOfPreviousLevel;
          }
          if (previous) {
            let item_ = new Item(item, previous, level);
            cache.allItens.push(item_);
            createdItemsInThisLevel.push(item_);
          }
        });

        itemsOfPreviousLevel = createdItemsInThisLevel;
      }
    });
  } else {
    clearFixedStates(cache.allItens);
  }


  if (!cache.fixedItens) {
    cache.fixedItens = [];
  }
  cache.fixedItens.length = 0;

  detectFixeds(root, cache.fixedItens);

  let createStylesConf = {
    lastZIndex: 10,
    styles: contexto.styles,
    identationDistance: contexto.props.identationDistance,
    getFixedExtraStyle: contexto.props.getFixedExtraStyle,
  };

  initializeItemStyle(root, createStylesConf);

  createStyles(root, createStylesConf);

  return createStylesConf.styles;
}

const defaultFixedExtraStyle = {};

class StickyHierarchicalContext extends React.Component {

  static childContextTypes = {
    getStyle: PropTypes.func,
    register: PropTypes.func,
    clearCacheAndUpdate: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.components = [];
    this.styles = [];
    this.cache = {
      root: null,
    };
    this.preFixedItems = [];
  }
  componentDidMount = () => {
    window.addEventListener('scroll', this.___calculateStyles);
    window.addEventListener('touchmove', this.___calculateStyles);
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.___calculateStyles);
    window.removeEventListener('touchmove', this.___calculateStyles);
  }

  getChildContext = () => {
    return {
      getStyle: this._getStyle,
      register: this._register,
      clearCacheAndUpdate: this._clearCacheAndUpdate,
    };
  }

  _clearCache = () => {
    this.cache.root = null;
    if (this.cache.allItens) {
      clearFixedStates(this.cache.allItens);
      delete this.cache.allItens;
    }
    if (this.cache.fixedItens) {
      delete this.cache.fixedItens;
    }
  }

  _clearCacheAndUpdate = () => {
    this._clearCache();
    this.___calculateStyles();
  }

  updateFixedStyles = () => {
    this._clearCache();
    this._calculateStyles();
  }

  _register = (component, level) => {
    const {components} = this;

    this.cache.root = null;

    if (!components[level]) {
      components[level] = [];
    }

    if (!this.lastRegistrationId) {
      this.lastRegistrationId = 1;
    }
    let registrationId = this.lastRegistrationId++;


    components[level][registrationId] = {
      component,
      offsetTop_: component.domRef2.offsetTop,
      offsetTop() {
        let result;
        if (this.component.domRef2.style.position !== 'fixed') {
          this.offsetTop_ = this.component.domRef2.offsetTop;
        }
        result = this.offsetTop_;
        return result;
      },
      offsetHeight() {
        return this.component.domRef2.offsetHeight;
      },
      registrationId,
    };

    return {
      registrationId,
      unregister: () => {
        const {components, styles} = this;

        if (styles[level] && styles[level][registrationId]) {
          delete styles[level][registrationId];
        }

        delete components[level][registrationId];
      },
    };
  }

  _getStyle = (level, registrationRef) => {

    const {styles} = this;


    if (registrationRef && styles[level] && styles[level][registrationRef.registrationId]) {
      return styles[level][registrationRef.registrationId];
    } else {
      return staticStyle;
    }
  }

  _calculateStyles = () => {
    this.styles = [];

    let contexto = {
      props: this.props,
      components: this.components,
      styles: this.styles,
      cache: this.cache,
    };


    __calculateStyles(contexto, this.props.cellUp, this.preFixedItems);
  }


  ___calculateStyles = () => {

    this._calculateStyles();
  }

  render() {
    const {children} = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }

}

StickyHierarchicalContext.defaultProps = {
  identationDistance: 0,
  getFixedExtraStyle: () => defaultFixedExtraStyle,
};

StickyHierarchicalContext.propTypes = {
  children: PropTypes.any,
  getFixedExtraStyle: PropTypes.func,
  identationDistance: PropTypes.number,
}

export default StickyHierarchicalContext;
