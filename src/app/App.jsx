import React from 'react';
import {StickyHierarchicalContext, StickyHierarchicalItem} from '../sticky';
import styles  from './styles.css'


class App extends React.Component {

   cellUp = (data) => {
    console.log("吸顶了！！！！", data);
   }
   render() {
      return (
         <div>
          <div className="content" style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 100,
          }}
          >
          </div>


          <StickyHierarchicalContext cellUp = {this.cellUp}>
            <div className={styles.divider + " " + styles['divider--short']} />

            <StickyHierarchicalItem hierarchicalLevel={0}>
              <div className={styles.content}>
                <div className={styles.logo}>
                <span style={{
                  display: 'inline-block',
                  transform: 'scale(1.4, 2)',
                  paddingTop: 6,
                }}
                >
                  StickyHierarchical
                </span>
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />
            <StickyHierarchicalItem hierarchicalLevel={1}>
              <div className={styles.content}>
                 <div className={styles.block + " " + styles['block--tall']} >
                  1
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={2}>
              <div className={styles.content}>
                <div className={styles.block} >
                  1.1
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={3}>
              <div className={styles.content}>
                <div className={styles.block + " " + styles['block--short']} >
                  1.1.1
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={3}>
              <div className={styles.content}>
                <div className={styles.block + " " + styles['block--short']} >
                  1.1.2
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={3}>
              <div className={styles.content}>
                <div className={styles.block + " " + styles['block--short']} >
                  1.1.3
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={2}>
              <div className={styles.content}>
                <div className={styles.block} >
                  1.2
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={1}>
              <div className={styles.content}>
                <div className={styles.block} >
                  2
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={1}>
              <div className={styles.content}>
                <div className={styles.block} >
                  3
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={2}>
              <div className={styles.content}>
                <div className={styles.block}>
                  3.1
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={3}>
              <div className={styles.content}>
                <div className={styles.block + " " + styles['block--short']} >
                  3.1.1
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={3}>
              <div className={styles.content}>
                <div className={styles.block + " " + styles['block--short']} >
                  3.1.2
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

            <StickyHierarchicalItem hierarchicalLevel={4}>
              <div className={styles.content}>
                <div className={styles.block + " " + styles['block--content']} >
                  <a className="link" href="https://github.com/lucas-issa/react-sticky-hierarchical">Fork me on Github</a>
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider + " " + styles['divider--short']} />


            <StickyHierarchicalItem hierarchicalLevel={5}>
              <div className={styles.content}>
                <div className={styles.block + " " + styles['block--doc']} >
                  <p><a href="https://github.com/lucas-issa/react-sticky-hierarchical">Documentation</a></p>
                </div>
              </div>
            </StickyHierarchicalItem>

            <div className={styles.divider} />

          </StickyHierarchicalContext>
        </div>
      );
   }
}



export default App;