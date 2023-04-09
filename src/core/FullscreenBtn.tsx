import React from 'react'
import { Button } from 'reakit/Button'

export default class FullscreenBtn extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { isFullscreen: false }
  }

  enterFullScreen = () => {
    var elem = document.getElementById("main") as any;
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        this.setState({ isFullscreen: true })
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
        this.setState({ isFullscreen: true })
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
        this.setState({ isFullscreen: true })
      }
    }
  }
  
  exitFullScreen = () => {
    const doc = document as any
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
      this.setState({ isFullscreen: false })
    } else if (doc.webkitExitFullscreen) { /* Safari */
      doc.webkitExitFullscreen();
      this.setState({ isFullscreen: false })
    } else if (doc.msExitFullscreen) { /* IE11 */
      doc.msExitFullscreen();
      this.setState({ isFullscreen: false })
    }
  }

  render() {
    const { isFullscreen } = this.state as any
    console.log('isFullscreen: ', isFullscreen)
    if (!isFullscreen) {
      return (
        <Button onClick={this.enterFullScreen}>
          Enter Fullscreen
        </Button>
      )
    }
    return (
      <Button onClick={this.exitFullScreen}>
        Exit Fullscreen
      </Button>
    )
  }
}