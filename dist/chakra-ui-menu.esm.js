import { useMultiStyleConfig, omitThemingProps, useTheme, StylesProvider, forwardRef, chakra, useStyles } from '@chakra-ui/system';
import { focus, getOwnerDocument, normalizeEventKey, dataAttr, callAllHandlers, isHTMLElement, getNextItemFromSearch, determineLazyBehavior, isActiveElement, isString, isArray, removeItem, addItem, runIfFn, __DEV__, cx, callAll } from '@chakra-ui/utils';
import { motion } from 'framer-motion';
import * as React from 'react';
import { useClickable } from '@chakra-ui/clickable';
import { createDescendantContext } from '@chakra-ui/descendant';
import { useFocusOnShow, useDisclosure, useOutsideClick, useUpdateEffect, useFocusOnHide, useIds, useUnmountEffect, useShortcut, useId, useControllableState } from '@chakra-ui/hooks';
import { useAnimationState } from '@chakra-ui/hooks/use-animation-state';
import { usePopper } from '@chakra-ui/popper';
import { createContext, mergeRefs, getValidChildren } from '@chakra-ui/react-utils';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _excluded$1 = ["id", "closeOnSelect", "closeOnBlur", "initialFocusRef", "autoSelect", "isLazy", "isOpen", "defaultIsOpen", "onClose", "onOpen", "placement", "lazyBehavior", "direction", "computePositionOnMount", "returnFocusOnClose"],
    _excluded2$1 = ["onMouseEnter", "onMouseMove", "onMouseLeave", "onClick", "onFocus", "isDisabled", "isFocusable", "closeOnSelect", "type"],
    _excluded3$1 = ["type", "isChecked"],
    _excluded4$1 = ["children", "type", "value", "defaultValue", "onChange"];
/* -------------------------------------------------------------------------------------------------
 * Create context to track descendants and their indices
 * -----------------------------------------------------------------------------------------------*/

var _createDescendantCont = createDescendantContext(),
    MenuDescendantsProvider = _createDescendantCont[0],
    useMenuDescendantsContext = _createDescendantCont[1],
    useMenuDescendants = _createDescendantCont[2],
    useMenuDescendant = _createDescendantCont[3];

var _createContext = createContext({
  strict: false,
  name: "MenuContext"
}),
    MenuProvider = _createContext[0],
    useMenuContext = _createContext[1];

/**
 * React Hook to manage a menu
 *
 * It provides the logic and will be used with react context
 * to propagate its return value to all children
 */
function useMenu(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      id = _props.id,
      _props$closeOnSelect = _props.closeOnSelect,
      closeOnSelect = _props$closeOnSelect === void 0 ? true : _props$closeOnSelect,
      _props$closeOnBlur = _props.closeOnBlur,
      closeOnBlur = _props$closeOnBlur === void 0 ? true : _props$closeOnBlur,
      initialFocusRef = _props.initialFocusRef,
      _props$autoSelect = _props.autoSelect,
      autoSelect = _props$autoSelect === void 0 ? true : _props$autoSelect,
      isLazy = _props.isLazy,
      isOpenProp = _props.isOpen,
      defaultIsOpen = _props.defaultIsOpen,
      onCloseProp = _props.onClose,
      onOpenProp = _props.onOpen,
      _props$placement = _props.placement,
      placement = _props$placement === void 0 ? "bottom-start" : _props$placement,
      _props$lazyBehavior = _props.lazyBehavior,
      lazyBehavior = _props$lazyBehavior === void 0 ? "unmount" : _props$lazyBehavior,
      direction = _props.direction,
      _props$computePositio = _props.computePositionOnMount,
      computePositionOnMount = _props$computePositio === void 0 ? false : _props$computePositio,
      _props$returnFocusOnC = _props.returnFocusOnClose,
      returnFocusOnClose = _props$returnFocusOnC === void 0 ? true : _props$returnFocusOnC,
      popperProps = _objectWithoutPropertiesLoose(_props, _excluded$1);
  /**
   * Prepare the reference to the menu and disclosure
   */


  var menuRef = React.useRef(null);
  var buttonRef = React.useRef(null);
  /**
   * Context to register all menu item nodes
   */

  var descendants = useMenuDescendants();
  var focusMenu = React.useCallback(function () {
    focus(menuRef.current, {
      nextTick: true,
      selectTextIfInput: false
    });
  }, []);
  var focusFirstItem = React.useCallback(function () {
    var id = setTimeout(function () {
      if (initialFocusRef) {
        if (initialFocusRef.current) {
          initialFocusRef.current.focus();
          var index = descendants.indexOf(initialFocusRef.current);
          setFocusedIndex(index);
        }
      } else {
        var first = descendants.firstEnabled();
        if (first) setFocusedIndex(first.index);
      }
    });
    timeoutIds.current.add(id);
  }, [descendants, initialFocusRef]);
  var focusLastItem = React.useCallback(function () {
    var id = setTimeout(function () {
      var last = descendants.lastEnabled();
      if (last) setFocusedIndex(last.index);
    });
    timeoutIds.current.add(id);
  }, [descendants]);
  var onOpenInternal = React.useCallback(function () {
    onOpenProp == null ? void 0 : onOpenProp();

    if (autoSelect) {
      focusFirstItem();
    } else {
      focusMenu();
    }
  }, [autoSelect, focusFirstItem, focusMenu, onOpenProp]);
  useFocusOnShow(menuRef, {
    focusRef: initialFocusRef,
    visible: isOpenProp,
    shouldFocus: true
  });

  var _useDisclosure = useDisclosure({
    isOpen: isOpenProp,
    defaultIsOpen: defaultIsOpen,
    onClose: onCloseProp,
    onOpen: onOpenInternal
  }),
      isOpen = _useDisclosure.isOpen,
      onOpen = _useDisclosure.onOpen,
      onClose = _useDisclosure.onClose,
      onToggle = _useDisclosure.onToggle;

  useOutsideClick({
    enabled: isOpen && closeOnBlur,
    ref: menuRef,
    handler: function handler(event) {
      var _buttonRef$current;

      if (!((_buttonRef$current = buttonRef.current) != null && _buttonRef$current.contains(event.target))) {
        onClose();
      }
    }
  });
  /**
   * Add some popper.js for dynamic positioning
   */

  var popper = usePopper(_extends({}, popperProps, {
    enabled: isOpen || computePositionOnMount,
    placement: placement,
    direction: direction
  }));

  var _React$useState = React.useState(-1),
      focusedIndex = _React$useState[0],
      setFocusedIndex = _React$useState[1];
  /**
   * Focus the button when we close the menu
   */


  useUpdateEffect(function () {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);
  useFocusOnHide(menuRef, {
    focusRef: buttonRef,
    visible: isOpen,
    shouldFocus: returnFocusOnClose
  });
  var animationState = useAnimationState({
    isOpen: isOpen,
    ref: menuRef
  });
  /**
   * Generate unique ids for menu's list and button
   */

  var _useIds = useIds(id, "menu-button", "menu-list"),
      buttonId = _useIds[0],
      menuId = _useIds[1];

  var openAndFocusMenu = React.useCallback(function () {
    onOpen();
    focusMenu();
  }, [onOpen, focusMenu]);
  var timeoutIds = React.useRef(new Set([]));
  useUnmountEffect(function () {
    timeoutIds.current.forEach(function (id) {
      return clearTimeout(id);
    });
    timeoutIds.current.clear();
  });
  var openAndFocusFirstItem = React.useCallback(function () {
    onOpen();
    focusFirstItem();
  }, [focusFirstItem, onOpen]);
  var openAndFocusLastItem = React.useCallback(function () {
    onOpen();
    focusLastItem();
  }, [onOpen, focusLastItem]);
  var refocus = React.useCallback(function () {
    var _menuRef$current, _descendants$item;

    var doc = getOwnerDocument(menuRef.current);
    var hasFocusWithin = (_menuRef$current = menuRef.current) == null ? void 0 : _menuRef$current.contains(doc.activeElement);
    var shouldRefocus = isOpen && !hasFocusWithin;
    if (!shouldRefocus) return;
    var node = (_descendants$item = descendants.item(focusedIndex)) == null ? void 0 : _descendants$item.node;

    if (node) {
      focus(node, {
        selectTextIfInput: false,
        preventScroll: false
      });
    }
  }, [isOpen, focusedIndex, descendants]);
  return {
    openAndFocusMenu: openAndFocusMenu,
    openAndFocusFirstItem: openAndFocusFirstItem,
    openAndFocusLastItem: openAndFocusLastItem,
    onTransitionEnd: refocus,
    unstable__animationState: animationState,
    descendants: descendants,
    popper: popper,
    buttonId: buttonId,
    menuId: menuId,
    forceUpdate: popper.forceUpdate,
    orientation: "vertical",
    isOpen: isOpen,
    onToggle: onToggle,
    onOpen: onOpen,
    onClose: onClose,
    menuRef: menuRef,
    buttonRef: buttonRef,
    focusedIndex: focusedIndex,
    closeOnSelect: closeOnSelect,
    closeOnBlur: closeOnBlur,
    autoSelect: autoSelect,
    setFocusedIndex: setFocusedIndex,
    isLazy: isLazy,
    lazyBehavior: lazyBehavior,
    initialFocusRef: initialFocusRef
  };
}

/**
 * React Hook to manage a menu button.
 *
 * The assumption here is that the `useMenu` hook is used
 * in a component higher up the tree, and its return value
 * is passed as `context` to this hook.
 */
function useMenuButton(props, externalRef) {
  if (props === void 0) {
    props = {};
  }

  if (externalRef === void 0) {
    externalRef = null;
  }

  var menu = useMenuContext();
  var onToggle = menu.onToggle,
      popper = menu.popper,
      openAndFocusFirstItem = menu.openAndFocusFirstItem,
      openAndFocusLastItem = menu.openAndFocusLastItem;
  var onKeyDown = React.useCallback(function (event) {
    var eventKey = normalizeEventKey(event);
    var keyMap = {
      Enter: openAndFocusFirstItem,
      ArrowDown: openAndFocusFirstItem,
      ArrowUp: openAndFocusLastItem
    };
    var action = keyMap[eventKey];

    if (action) {
      event.preventDefault();
      event.stopPropagation();
      action(event);
    }
  }, [openAndFocusFirstItem, openAndFocusLastItem]);
  return _extends({}, props, {
    ref: mergeRefs(menu.buttonRef, externalRef, popper.referenceRef),
    id: menu.buttonId,
    "data-active": dataAttr(menu.isOpen),
    "aria-expanded": menu.isOpen,
    "aria-haspopup": "menu",
    "aria-controls": menu.menuId,
    onClick: callAllHandlers(props.onClick, onToggle),
    onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown)
  });
}

function isTargetMenuItem(target) {
  var _target$getAttribute;

  // this will catch `menuitem`, `menuitemradio`, `menuitemcheckbox`
  return isHTMLElement(target) && !!((_target$getAttribute = target.getAttribute("role")) != null && _target$getAttribute.startsWith("menuitem"));
}
/* -------------------------------------------------------------------------------------------------
 * useMenuList
 * -----------------------------------------------------------------------------------------------*/


/**
 * React Hook to manage a menu list.
 *
 * The assumption here is that the `useMenu` hook is used
 * in a component higher up the tree, and its return value
 * is passed as `context` to this hook.
 */
function useMenuList(props, ref) {
  if (props === void 0) {
    props = {};
  }

  if (ref === void 0) {
    ref = null;
  }

  var menu = useMenuContext();

  if (!menu) {
    throw new Error("useMenuContext: context is undefined. Seems you forgot to wrap component within <Menu>");
  }

  var focusedIndex = menu.focusedIndex,
      setFocusedIndex = menu.setFocusedIndex,
      menuRef = menu.menuRef,
      isOpen = menu.isOpen,
      onClose = menu.onClose,
      menuId = menu.menuId,
      isLazy = menu.isLazy,
      lazyBehavior = menu.lazyBehavior,
      animated = menu.unstable__animationState;
  var descendants = useMenuDescendantsContext();
  /**
   * Hook that creates a keydown event handler that listens
   * to printable keyboard character press
   */

  var createTypeaheadHandler = useShortcut({
    preventDefault: function preventDefault(event) {
      return event.key !== " " && isTargetMenuItem(event.target);
    }
  });
  var onKeyDown = React.useCallback(function (event) {
    var eventKey = normalizeEventKey(event);
    var keyMap = {
      Tab: function Tab(event) {
        return event.preventDefault();
      },
      Escape: onClose,
      ArrowDown: function ArrowDown() {
        var next = descendants.nextEnabled(focusedIndex);
        if (next) setFocusedIndex(next.index);
      },
      ArrowUp: function ArrowUp() {
        var prev = descendants.prevEnabled(focusedIndex);
        if (prev) setFocusedIndex(prev.index);
      }
    };
    var fn = keyMap[eventKey];

    if (fn) {
      event.preventDefault();
      fn(event);
      return;
    }
    /**
     * Typeahead: Based on current character pressed,
     * find the next item to be selected
     */


    var onTypeahead = createTypeaheadHandler(function (character) {
      var nextItem = getNextItemFromSearch(descendants.values(), character, function (item) {
        var _item$node$textConten, _item$node;

        return (_item$node$textConten = item == null ? void 0 : (_item$node = item.node) == null ? void 0 : _item$node.textContent) != null ? _item$node$textConten : "";
      }, descendants.item(focusedIndex));

      if (nextItem) {
        var index = descendants.indexOf(nextItem.node);
        setFocusedIndex(index);
      }
    });

    if (isTargetMenuItem(event.target)) {
      onTypeahead(event);
    }
  }, [descendants, focusedIndex, createTypeaheadHandler, onClose, setFocusedIndex]);
  var hasBeenOpened = React.useRef(false);

  if (isOpen) {
    hasBeenOpened.current = true;
  }

  var shouldRenderChildren = determineLazyBehavior({
    hasBeenSelected: hasBeenOpened.current,
    isLazy: isLazy,
    lazyBehavior: lazyBehavior,
    isSelected: animated.present
  });
  return _extends({}, props, {
    ref: mergeRefs(menuRef, ref),
    children: shouldRenderChildren ? props.children : null,
    tabIndex: -1,
    role: "menu",
    id: menuId,
    style: _extends({}, props.style, {
      transformOrigin: "var(--popper-transform-origin)"
    }),
    "aria-orientation": "vertical",
    onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown)
  });
}
/* -------------------------------------------------------------------------------------------------
 * useMenuPosition: Composes usePopper to position the menu
 * -----------------------------------------------------------------------------------------------*/

function useMenuPositioner(props) {
  if (props === void 0) {
    props = {};
  }

  var _useMenuContext = useMenuContext(),
      popper = _useMenuContext.popper,
      isOpen = _useMenuContext.isOpen;

  return popper.getPopperProps(_extends({}, props, {
    style: _extends({
      visibility: isOpen ? "visible" : "hidden"
    }, props.style)
  }));
}
/* -------------------------------------------------------------------------------------------------
 * useMenuItem: Hook for each menu item within the menu list.
   We also use it in `useMenuItemOption`
 * -----------------------------------------------------------------------------------------------*/

function useMenuItem(props, externalRef) {
  if (props === void 0) {
    props = {};
  }

  if (externalRef === void 0) {
    externalRef = null;
  }

  var _props2 = props,
      onMouseEnterProp = _props2.onMouseEnter,
      onMouseMoveProp = _props2.onMouseMove,
      onMouseLeaveProp = _props2.onMouseLeave,
      onClickProp = _props2.onClick,
      onFocusProp = _props2.onFocus,
      isDisabled = _props2.isDisabled,
      isFocusable = _props2.isFocusable,
      closeOnSelect = _props2.closeOnSelect,
      typeProp = _props2.type,
      htmlProps = _objectWithoutPropertiesLoose(_props2, _excluded2$1);

  var menu = useMenuContext();
  var setFocusedIndex = menu.setFocusedIndex,
      focusedIndex = menu.focusedIndex,
      menuCloseOnSelect = menu.closeOnSelect,
      onClose = menu.onClose,
      menuRef = menu.menuRef,
      isOpen = menu.isOpen,
      menuId = menu.menuId;
  var ref = React.useRef(null);
  var id = menuId + "-menuitem-" + useId();
  /**
   * Register the menuitem's node into the domContext
   */

  var _useMenuDescendant = useMenuDescendant({
    disabled: isDisabled && !isFocusable
  }),
      index = _useMenuDescendant.index,
      register = _useMenuDescendant.register;

  var onMouseEnter = React.useCallback(function (event) {
    onMouseEnterProp == null ? void 0 : onMouseEnterProp(event);
    if (isDisabled) return;
    setFocusedIndex(index);
  }, [setFocusedIndex, index, isDisabled, onMouseEnterProp]);
  var onMouseMove = React.useCallback(function (event) {
    onMouseMoveProp == null ? void 0 : onMouseMoveProp(event);

    if (ref.current && !isActiveElement(ref.current)) {
      onMouseEnter(event);
    }
  }, [onMouseEnter, onMouseMoveProp]);
  var onMouseLeave = React.useCallback(function (event) {
    onMouseLeaveProp == null ? void 0 : onMouseLeaveProp(event);
    if (isDisabled) return;
    setFocusedIndex(-1);
  }, [setFocusedIndex, isDisabled, onMouseLeaveProp]);
  var onClick = React.useCallback(function (event) {
    onClickProp == null ? void 0 : onClickProp(event);
    if (!isTargetMenuItem(event.currentTarget)) return;
    /**
     * Close menu and parent menus, allowing the MenuItem
     * to override its parent menu's `closeOnSelect` prop.
     */

    if (closeOnSelect != null ? closeOnSelect : menuCloseOnSelect) {
      onClose();
    }
  }, [onClose, onClickProp, menuCloseOnSelect, closeOnSelect]);
  var onFocus = React.useCallback(function (event) {
    onFocusProp == null ? void 0 : onFocusProp(event);
    setFocusedIndex(index);
  }, [setFocusedIndex, onFocusProp, index]);
  var isFocused = index === focusedIndex;
  var trulyDisabled = isDisabled && !isFocusable;
  useUpdateEffect(function () {
    if (!isOpen) return;

    if (isFocused && !trulyDisabled && ref.current) {
      focus(ref.current, {
        nextTick: true,
        selectTextIfInput: false,
        preventScroll: false
      });
    } else if (menuRef.current && !isActiveElement(menuRef.current)) {
      focus(menuRef.current, {
        preventScroll: false
      });
    }
  }, [isFocused, trulyDisabled, menuRef, isOpen]);
  var clickableProps = useClickable({
    onClick: onClick,
    onFocus: onFocus,
    onMouseEnter: onMouseEnter,
    onMouseMove: onMouseMove,
    onMouseLeave: onMouseLeave,
    ref: mergeRefs(register, ref, externalRef),
    isDisabled: isDisabled,
    isFocusable: isFocusable
  });
  return _extends({}, htmlProps, clickableProps, {
    type: typeProp != null ? typeProp : clickableProps.type,
    id: id,
    role: "menuitem",
    tabIndex: isFocused ? 0 : -1
  });
}
/* -------------------------------------------------------------------------------------------------
 * useMenuOption: Composes useMenuItem to provide a selectable/checkable menu item
 * -----------------------------------------------------------------------------------------------*/

function useMenuOption(props, ref) {
  if (props === void 0) {
    props = {};
  }

  if (ref === void 0) {
    ref = null;
  }

  var _props3 = props,
      _props3$type = _props3.type,
      type = _props3$type === void 0 ? "radio" : _props3$type,
      isChecked = _props3.isChecked,
      rest = _objectWithoutPropertiesLoose(_props3, _excluded3$1);

  var ownProps = useMenuItem(rest, ref);
  return _extends({}, ownProps, {
    role: "menuitem" + type,
    "aria-checked": isChecked
  });
}
/* -------------------------------------------------------------------------------------------------
 * useMenuOptionGroup: Manages the state of multiple selectable menuitem or menu option
 * -----------------------------------------------------------------------------------------------*/

function useMenuOptionGroup(props) {
  if (props === void 0) {
    props = {};
  }

  var _props4 = props,
      children = _props4.children,
      _props4$type = _props4.type,
      type = _props4$type === void 0 ? "radio" : _props4$type,
      valueProp = _props4.value,
      defaultValue = _props4.defaultValue,
      onChangeProp = _props4.onChange,
      htmlProps = _objectWithoutPropertiesLoose(_props4, _excluded4$1);

  var isRadio = type === "radio";
  var fallback = isRadio ? "" : [];

  var _useControllableState = useControllableState({
    defaultValue: defaultValue != null ? defaultValue : fallback,
    value: valueProp,
    onChange: onChangeProp
  }),
      value = _useControllableState[0],
      setValue = _useControllableState[1];

  var onChange = React.useCallback(function (selectedValue) {
    if (type === "radio" && isString(value)) {
      setValue(selectedValue);
    }

    if (type === "checkbox" && isArray(value)) {
      var nextValue = value.includes(selectedValue) ? removeItem(value, selectedValue) : addItem(value, selectedValue);
      setValue(nextValue);
    }
  }, [value, setValue, type]);
  var validChildren = getValidChildren(children);
  var clones = validChildren.map(function (child) {
    /**
     * We've added an internal `id` to each `MenuItemOption`,
     * let's use that for type-checking.
     *
     * We can't rely on displayName or the element's type since
     * they can be changed by the user.
     */
    if (child.type.id !== "MenuItemOption") return child;

    var onClick = function onClick(event) {
      onChange(child.props.value);
      child.props.onClick == null ? void 0 : child.props.onClick(event);
    };

    var isChecked = type === "radio" ? child.props.value === value : value.includes(child.props.value);
    return /*#__PURE__*/React.cloneElement(child, {
      type: type,
      onClick: onClick,
      isChecked: isChecked
    });
  });
  return _extends({}, htmlProps, {
    children: clones
  });
}
function useMenuState() {
  var _useMenuContext2 = useMenuContext(),
      isOpen = _useMenuContext2.isOpen,
      onClose = _useMenuContext2.onClose;

  return {
    isOpen: isOpen,
    onClose: onClose
  };
}

var _excluded = ["descendants"],
    _excluded2 = ["children", "as"],
    _excluded3 = ["rootProps"],
    _excluded4 = ["type"],
    _excluded5 = ["icon", "iconSpacing", "command", "commandSpacing", "children"],
    _excluded6 = ["icon", "iconSpacing"],
    _excluded7 = ["className", "title"],
    _excluded8 = ["title", "children", "className"],
    _excluded9 = ["className", "children"],
    _excluded10 = ["className"];

/**
 * Menu provides context, state, and focus management
 * to its sub-components. It doesn't render any DOM node.
 */
var Menu = function Menu(props) {
  var children = props.children;
  var styles = useMultiStyleConfig("Menu", props);
  var ownProps = omitThemingProps(props);

  var _useTheme = useTheme(),
      direction = _useTheme.direction;

  var _useMenu = useMenu(_extends({}, ownProps, {
    direction: direction
  })),
      descendants = _useMenu.descendants,
      ctx = _objectWithoutPropertiesLoose(_useMenu, _excluded);

  var context = React.useMemo(function () {
    return ctx;
  }, [ctx]);
  var isOpen = context.isOpen,
      onClose = context.onClose,
      forceUpdate = context.forceUpdate;
  return /*#__PURE__*/React.createElement(MenuDescendantsProvider, {
    value: descendants
  }, /*#__PURE__*/React.createElement(MenuProvider, {
    value: context
  }, /*#__PURE__*/React.createElement(StylesProvider, {
    value: styles
  }, runIfFn(children, {
    isOpen: isOpen,
    onClose: onClose,
    forceUpdate: forceUpdate
  }))));
};

if (__DEV__) {
  Menu.displayName = "Menu";
}

var StyledMenuButton = /*#__PURE__*/forwardRef(function (props, ref) {
  var styles = useStyles();
  return /*#__PURE__*/React.createElement(chakra.button, _extends({
    ref: ref
  }, props, {
    __css: _extends({
      display: "inline-flex",
      appearance: "none",
      alignItems: "center",
      outline: 0
    }, styles.button)
  }));
});
/**
 * The trigger for the menu list. Must be a direct child of `Menu`.
 */

var MenuButton = /*#__PURE__*/forwardRef(function (props, ref) {
  props.children;
      var As = props.as,
      rest = _objectWithoutPropertiesLoose(props, _excluded2);

  var buttonProps = useMenuButton(rest, ref);
  var Element = As || StyledMenuButton;
  return /*#__PURE__*/React.createElement(Element, _extends({}, buttonProps, {
    className: cx("chakra-menu__menu-button", props.className)
  }), /*#__PURE__*/React.createElement(chakra.span, {
    __css: {
      pointerEvents: "none",
      flex: "1 1 auto",
      minW: 0
    }
  }, props.children));
});

if (__DEV__) {
  MenuButton.displayName = "MenuButton";
}

var motionVariants = {
  enter: {
    visibility: "visible",
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    transitionEnd: {
      visibility: "hidden"
    },
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
      easings: "easeOut"
    }
  }
};

function __motion(el) {
  var m = motion;

  if ("custom" in m && typeof m.custom === "function") {
    return m.custom(el);
  }

  return m(el);
} // @future: only call `motion(chakra.div)` when we drop framer-motion v3 support


var MenuTransition = __motion(chakra.div);

var MenuList = /*#__PURE__*/forwardRef(function (props, ref) {
  var _props$zIndex, _styles$list;

  var rootProps = props.rootProps,
      rest = _objectWithoutPropertiesLoose(props, _excluded3);

  var _useMenuContext = useMenuContext(),
      isOpen = _useMenuContext.isOpen,
      onTransitionEnd = _useMenuContext.onTransitionEnd,
      animated = _useMenuContext.unstable__animationState;

  var ownProps = useMenuList(rest, ref);
  var positionerProps = useMenuPositioner(rootProps);
  var styles = useStyles();
  return /*#__PURE__*/React.createElement(chakra.div, _extends({}, positionerProps, {
    __css: {
      zIndex: (_props$zIndex = props.zIndex) != null ? _props$zIndex : (_styles$list = styles.list) == null ? void 0 : _styles$list.zIndex
    }
  }), /*#__PURE__*/React.createElement(MenuTransition, _extends({}, ownProps, {
    /**
     * We could call this on either `onAnimationComplete` or `onUpdate`.
     * It seems the re-focusing works better with the `onUpdate`
     */
    onUpdate: onTransitionEnd,
    onAnimationComplete: callAll(animated.onComplete, ownProps.onAnimationComplete),
    className: cx("chakra-menu__menu-list", ownProps.className),
    variants: motionVariants,
    initial: false,
    animate: isOpen ? "enter" : "exit",
    __css: _extends({
      outline: 0
    }, styles.list)
  })));
});

if (__DEV__) {
  MenuList.displayName = "MenuList";
}

var StyledMenuItem = /*#__PURE__*/forwardRef(function (props, ref) {
  var type = props.type,
      rest = _objectWithoutPropertiesLoose(props, _excluded4);

  var styles = useStyles();
  /**
   * Given another component, use its type if present
   * Else, use no type to avoid invalid html, e.g. <a type="button" />
   * Else, fall back to "button"
   */

  var btnType = rest.as || type ? type != null ? type : undefined : "button";
  var buttonStyles = React.useMemo(function () {
    return _extends({
      textDecoration: "none",
      color: "inherit",
      userSelect: "none",
      display: "flex",
      width: "100%",
      alignItems: "center",
      textAlign: "start",
      flex: "0 0 auto",
      outline: 0
    }, styles.item);
  }, [styles.item]);
  return /*#__PURE__*/React.createElement(chakra.button, _extends({
    ref: ref,
    type: btnType
  }, rest, {
    __css: buttonStyles
  }));
});
var MenuItem = /*#__PURE__*/forwardRef(function (props, ref) {
  var icon = props.icon,
      _props$iconSpacing = props.iconSpacing,
      iconSpacing = _props$iconSpacing === void 0 ? "0.75rem" : _props$iconSpacing,
      command = props.command,
      _props$commandSpacing = props.commandSpacing,
      commandSpacing = _props$commandSpacing === void 0 ? "0.75rem" : _props$commandSpacing,
      children = props.children,
      rest = _objectWithoutPropertiesLoose(props, _excluded5);

  var menuitemProps = useMenuItem(rest, ref);
  var shouldWrap = icon || command;

  var _children = shouldWrap ? /*#__PURE__*/React.createElement("span", {
    style: {
      pointerEvents: "none",
      flex: 1
    }
  }, children) : children;

  return /*#__PURE__*/React.createElement(StyledMenuItem, _extends({}, menuitemProps, {
    className: cx("chakra-menu__menuitem", menuitemProps.className)
  }), icon && /*#__PURE__*/React.createElement(MenuIcon, {
    fontSize: "0.8em",
    marginEnd: iconSpacing
  }, icon), _children, command && /*#__PURE__*/React.createElement(MenuCommand, {
    marginStart: commandSpacing
  }, command));
});

if (__DEV__) {
  MenuItem.displayName = "MenuItem";
}

var CheckIcon = function CheckIcon(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 14 14",
    width: "1em",
    height: "1em"
  }, props), /*#__PURE__*/React.createElement("polygon", {
    fill: "currentColor",
    points: "5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"
  }));
};

var MenuItemOption = /*#__PURE__*/forwardRef(function (props, ref) {
  // menu option item should always be `type=button`, so we omit `type`
  var icon = props.icon,
      _props$iconSpacing2 = props.iconSpacing,
      iconSpacing = _props$iconSpacing2 === void 0 ? "0.75rem" : _props$iconSpacing2,
      rest = _objectWithoutPropertiesLoose(props, _excluded6);

  var optionProps = useMenuOption(rest, ref);
  return /*#__PURE__*/React.createElement(StyledMenuItem, _extends({}, optionProps, {
    className: cx("chakra-menu__menuitem-option", rest.className)
  }), icon !== null && /*#__PURE__*/React.createElement(MenuIcon, {
    fontSize: "0.8em",
    marginEnd: iconSpacing,
    opacity: props.isChecked ? 1 : 0
  }, icon || /*#__PURE__*/React.createElement(CheckIcon, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, optionProps.children));
});
MenuItemOption.id = "MenuItemOption";

if (__DEV__) {
  MenuItemOption.displayName = "MenuItemOption";
}

var MenuOptionGroup = function MenuOptionGroup(props) {
  var className = props.className,
      title = props.title,
      rest = _objectWithoutPropertiesLoose(props, _excluded7);

  var ownProps = useMenuOptionGroup(rest);
  return /*#__PURE__*/React.createElement(MenuGroup, _extends({
    title: title,
    className: cx("chakra-menu__option-group", className)
  }, ownProps));
};

if (__DEV__) {
  MenuOptionGroup.displayName = "MenuOptionGroup";
}

var MenuGroup = /*#__PURE__*/forwardRef(function (props, ref) {
  var title = props.title,
      children = props.children,
      className = props.className,
      rest = _objectWithoutPropertiesLoose(props, _excluded8);

  var _className = cx("chakra-menu__group__title", className);

  var styles = useStyles();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "chakra-menu__group",
    role: "group"
  }, title && /*#__PURE__*/React.createElement(chakra.p, _extends({
    className: _className
  }, rest, {
    __css: styles.groupTitle
  }), title), children);
});

if (__DEV__) {
  MenuGroup.displayName = "MenuGroup";
}

var MenuCommand = /*#__PURE__*/forwardRef(function (props, ref) {
  var styles = useStyles();
  return /*#__PURE__*/React.createElement(chakra.span, _extends({
    ref: ref
  }, props, {
    __css: styles.command,
    className: "chakra-menu__command"
  }));
});

if (__DEV__) {
  MenuCommand.displayName = "MenuCommand";
}

var MenuIcon = function MenuIcon(props) {
  var className = props.className,
      children = props.children,
      rest = _objectWithoutPropertiesLoose(props, _excluded9);

  var child = React.Children.only(children);
  var clone = /*#__PURE__*/React.isValidElement(child) ? /*#__PURE__*/React.cloneElement(child, {
    focusable: "false",
    "aria-hidden": true,
    className: cx("chakra-menu__icon", child.props.className)
  }) : null;

  var _className = cx("chakra-menu__icon-wrapper", className);

  return /*#__PURE__*/React.createElement(chakra.span, _extends({
    className: _className
  }, rest, {
    __css: {
      flexShrink: 0
    }
  }), clone);
};

if (__DEV__) {
  MenuIcon.displayName = "MenuIcon";
}

var MenuDivider = function MenuDivider(props) {
  var className = props.className,
      rest = _objectWithoutPropertiesLoose(props, _excluded10);

  var styles = useStyles();
  return /*#__PURE__*/React.createElement(chakra.hr, _extends({
    role: "separator",
    "aria-orientation": "horizontal",
    className: cx("chakra-menu__divider", className)
  }, rest, {
    __css: styles.divider
  }));
};

if (__DEV__) {
  MenuDivider.displayName = "MenuDivider";
}

export { Menu, MenuButton, MenuCommand, MenuDescendantsProvider, MenuDivider, MenuGroup, MenuIcon, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, MenuProvider, useMenu, useMenuButton, useMenuContext, useMenuDescendant, useMenuDescendants, useMenuDescendantsContext, useMenuItem, useMenuList, useMenuOption, useMenuOptionGroup, useMenuPositioner, useMenuState };
