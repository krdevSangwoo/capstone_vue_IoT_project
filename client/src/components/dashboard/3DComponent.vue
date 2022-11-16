<template>
  <div>
    <canvas @click="event" id="canvas" width="150" height="150"
    data-bs-toggle="tooltip" data-bs-placement="top"
    data-bs-custom-class="custom-tooltip"
    :data-bs-title="tooltipMsg"></canvas>
  </div>
</template>
<script>
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { Tooltip } from 'bootstrap'

export default {
  data () {
    return {
      tooltipMsg: '안녕하세요! 로그인을 부탁해요!',
      userName: '',
      tooltip: {},
      messages: [
        '님! 좋은 하루 보내세요!',
        '님! 오늘 기분 어때요?',
        '님! 오늘 좋아보여요!',
        '님! 오늘 하루도 화이팅!',
        '님! 어서오세요!',
        '님! 기다리고 있었어요!',
        '님! 보고 싶었어요!',
        '님! 오늘도 와주셨네요!',
        '님! 오늘은 더 특별한 하루가 되길 바래요!',
        '님! 오늘 저 어때요?'
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  setup () {},
  created () {
    this.userName = this.user.userName
    this.tooltipMsg = this.userName + '님 반가워요!'
  },
  mounted () {
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true
    })
    renderer.outputEncoding = THREE.sRGBEncoding

    const camera = new THREE.PerspectiveCamera(30, 1)
    camera.position.set(0, -0.5, 5.4)

    scene.background = new THREE.Color('white')
    const light = new THREE.DirectionalLight(0xffff00, 10)
    scene.add(light)

    // const controls = new OrbitControls(camera)
    // controls.rotateSpeed = 1.0
    // controls.zoomSpeed = 1.2
    // controls.panSpeed = 0.8
    // controls.minDistance = 5
    // controls.maxDistance = 100

    const loader = new GLTFLoader()
    loader.load('shiba/scene.gltf', function (gltf) {
      scene.add(gltf.scene)
      function animate () {
        requestAnimationFrame(animate)
        gltf.scene.rotation.y += 0.03
        renderer.render(scene, camera)
        // controls.update()
      }
      animate()
    })
    this.createTooltip(this.tooltipMsg)
  },
  unmounted () {
    this.deleteTooltip()
  },
  methods: {
    event () {
      const rand = Math.floor(Math.random() * 10)
      this.tooltipMsg = this.userName + this.messages[rand]
      this.deleteTooltip()
      this.createTooltip(this.tooltipMsg)
    },
    createTooltip (msg) {
      Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(tooltipNode => {
        this.tooltip = new Tooltip(tooltipNode)
        return this.tooltip
      })
      this.tooltipMsg = msg
      this.tooltip._config.title = this.tooltipMsg
      this.tooltip.show()
    },
    deleteTooltip () {
      this.tooltip.dispose()
    }
  }
}
</script>
<style>
  .custom-tooltip {
    --bs-tooltip-bg: var(--bs-primary);
    --bs-tooltip-color: white;
    --bs-tooltip-padding-x: 10px;
    --bs-tooltip-padding-y: 10px;
    --bs-tooltip-border-radius: 15px;
    --bs-tooltip-arrow-width: 10px;
    --bs-tooltip-arrow-height: 10px;
  }
</style>
