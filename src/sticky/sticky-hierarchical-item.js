import React from 'react';
// import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import PropTypes from 'prop-types';

class StickyHierarchicalItem extends React.Component {

  static contextTypes = {
    getStyle: PropTypes.func,
    register: PropTypes.func,
    clearCacheAndUpdate: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      height: null
    }
  }

  componentDidMount() {
    const {register, clearCacheAndUpdate} = this.context;
    const {hierarchicalLevel} = this.props;

    // this.offsetTop = this.domRef2.offsetTop;
    // this.offsetHeight = this.domRef2.offsetHeight;

    // this.resizeSensorCallback = () => {
    //   const {
    //     offsetTop,
    //     offsetHeight,
    //   } = this.domRef2;


    //   if (offsetTop !== this.offsetTop || offsetHeight !== this.offsetHeight) {
    //     this._setHeight(offsetHeight);
    //     this.offsetTop = offsetTop;
    //     this.offsetHeight = offsetHeight;
    //     clearCacheAndUpdate();
    //   }
    // };
    // this.resizeSensor = new ResizeSensor(this.domRef2, this.resizeSensorCallback);


    this.registrationRef = register(
      this,
      hierarchicalLevel
    );

    this._setHeight(this.offsetHeight);
  }

  componentDidUpdate() {
    const domRefOffsetHeight = this.domRef.offsetHeight;
    if (domRefOffsetHeight !== this.state.height) {
      this._setHeight(domRefOffsetHeight);
    }

  }

  componentWillUnmount() {
    // this.resizeSensor.detach(this.resizeSensorCallback);
    // this.resizeSensor.detach();
    this.registrationRef.unregister();
  }

  _setHeight(height) {
    this.setState({
      height,
    });
  }

  render() {
    const {getStyle} = this.context;
    const {children, hierarchicalLevel, stickyClassName} = this.props;
    const {height} = this.state;
    const style = getStyle(hierarchicalLevel, this.registrationRef);

    return (
      <div ref={domRef => this.domRef = domRef} style={{height}} data-hello="haha">
        <div
          // className={style.position && style.position === 'fixed' && stickyClassName}
          ref={domRef2 => this.domRef2 = domRef2}
          data-hello="xixix"
          style={style}
        >
          <div style={{position: 'absolute', top: 0, left: 0, backgroundColor: 'blue', padding: "4px 6px"}}>{ this.domRef2 && this.domRef2.offsetTop}</div>
          {children}
        </div>
      </div>
    );
  }

}

StickyHierarchicalItem.propTypes = {
    children: PropTypes.any,
    hierarchicalLevel: PropTypes.number,
    stickyClassName: PropTypes.object,
  }

export default StickyHierarchicalItem;
