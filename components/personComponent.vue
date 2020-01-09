<template>
  <component
    :is="wrapper"
    class="contact">
    <div
      v-if="imagePath"
      class="img"
      :style="`background-image: url(${imagePath});`"></div>

      <div :class="[{'full-width': !imagePath}, 'about']">
        <h2
          v-if="name"
          v-html="name"></h2>
        <h4
          v-if="title"
          v-html="title"></h4>

        <slot
          v-if="map"
          name="map"></slot>

        <template
          v-if="about"
          v-for="text, i in about">
          <p v-html="text"></p>
        </template>

        <table v-if="tableInfo">
          <caption class="sr-only">
            <template
              v-if="name">
              {{ name }}
            </template> Information Table
          </caption>

          <thead class="sr-only">
            <tr>
              <th scope="col">Key</th>
              <th scope="col">Value</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="tableInfo.website.ahref != ''">
              <th scope="row">Web:</th>
              <td>
                <a
                  class="external"
                  :href="tableInfo.website.ahref"
                  :alt="tableInfo.website.alt"
                  target="_blank"> {{ tableInfo.website.text }}
                </a>
              </td>
            </tr>

            <tr v-if="tableInfo.email != ''">
              <th scope="row">Email:</th>
              <td>{{ tableInfo.email.ahref }}</td>
            </tr>

            <tr
              v-if="tableInfo.telephone"
              v-for="tel, i in tableInfo.telephone">
              <th scope="row">Telephone:</th>
              <td>{{ tel.number }} - <template v-if="tel.label">{{ tel.label }} </template>
              </td>
            </tr>

            <tr v-if="tableInfo.address.streetAddress != ''">
              <th scope="row">Address:</th>
              <td>
                <template v-if="tableInfo.address.addressTitle">
                  {{ tableInfo.address.addressTitle }}<br>
                </template>

                <template v-if="tableInfo.address.streetAddress">
                  {{ tableInfo.address.streetAddress }} <template v-if="tableInfo.address.suite">
                  - Suite {{ tableInfo.address.suite }}
                  </template><br>
                </template>

                <template v-if="tableInfo.address.cityStateZip">
                  {{ tableInfo.address.cityStateZip }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </component>
</template>

<script>
/**
 * SOON TO BE PORTED BACK TO THE COBDS
 */
export default {
  name: "personComponent",
  status: "ready",
  release: "1.0.0",
  metaInfo: {
    title: "Persons Component | COB Design System",
  },
  props: {
    /**
     * The element used for Modals.
     * `div`
     */
    wrapper: {
      type:         String,
      default:      "div",
      validator: value => {
        return value.match(/(div)/)
      },
    },
    imagePath: {
      type:         String,
      default:      null,
    },
    name: {
      type:         String,
      defaut:       null,
    },
    title: {
      type:         String,
      defaut:       null,
    },
    about: {
      type:         Array,
      default:      null,
    },
    tableInfo: {
      type:         Object,
      default:      null
    },
    map: {
      type:         Boolean,
      default:      null,
    }
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss">
  .contact {
    display: flex;
    border-top: 1px solid $color-grey-light;
    width: 100%;

    &:last-of-type {
      margin: 0;
    }

    .vue-map-container {
      height: 300px;
      box-shadow: 0.25rem 0.25rem 0.75rem rgba(0, 0, 0, 0.20);
    }

    h4 {
      margin: 0 0 20px 20px;
      padding: 0 0 0 20px;
      border-left: 2px solid $color-grey;
    }

    .img {
      position: relative;
      display: block;
      margin: 0 40px 0 0;
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background-position: top center;
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.40);

      &:after {
        z-index: -1;
        position: absolute;
        content: '';
        width: 250px;
        height: 250px;
        left: -10px;
        bottom: -15px;
        display: block;
        border-radius: 50%;
        background-color: $color-grey-lighter;
      }
    }

    .about {
      width: calc(100% - 335px);
      margin-left: auto;

      &.full-width {
        width: 100%;
      }

      h2 {
        font-size: 24px;
        margin: 0 0 20px 0;

        &:after {
          background-color: $color-blue;
        }
      }

      h4 {
        color: lighten($text-color, 20%);
        font-size: 20px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      p {
        letter-spacing: .5px;
        font-weight: 500;
        font-style: italic;
        margin: 0 0 20px 0;
        line-height: 25px;
      }
    }

    @media (max-width: 575px) {
      flex-wrap: wrap;
      margin: 0 0 40px 0 !important;

      &:last-child {
        margin: 0 !important;
      }

      .img {
        width: 150px !important;
        height: 150px !important;
        margin: 0 0 20px 0 !important;

        &:after {
          width: 150px !important;
          height: 150px !important;
        }
      }

      .about {
        width: 100%;

        h2 {
          font-size: 20px !important;
        }

        h4 {
          font-size: 18px !important;
          margin: 0 0 10px 20px !important;
        }
      }

      table {
        display: block;

        tbody {
          display: block;
          width: 100%;

          tr {
            word-break: break-all;
            display: flex;
            flex-wrap: wrap;
            width: 100%;

            &:first-child {

              th {
                border: none;
              }
            }

            th, td {
              width: 100% !important;
            }

            th {
              padding: 15px 0 10px 5px;
              color: lighten($text-color, 10%);
            }

            td {
              padding: 0 15px 15px 30px;
              border: none;
            }
          }
        }
      }
    }

    @media (min-width: 576px) and (max-width: 767px) {
      flex-wrap: wrap;
      margin: 0 0 40px 0 !important;

      &:last-child {
        margin: 0 !important;
      }

      .img {
        width: 150px !important;
        height: 150px !important;
        margin: 0 0 20px 0 !important;

        &:after {
          width: 150px !important;
          height: 150px !important;
        }
      }

      .about {
        width: 100%;

        h2 {
          font-size: 20px !important;
        }

        h4 {
          font-size: 18px !important;
          margin: 0 0 10px 20px !important;
        }
      }

      table {
        display: block;

        tbody {
          display: block;
          width: 100%;

          tr {
            display: flex;
            flex-wrap: wrap;
            width: 100%;

            &:first-child {

              th {
                border: none;
              }
            }

            th, td {
              width: 100% !important;
            }

            th {
              padding: 15px 0 10px 5px;
              color: lighten($text-color, 10%);
            }

            td {
              padding: 0 0 15px 30px;
              border: none;
            }
          }
        }
      }
    }

    @media (min-width: 768px) and (max-width: 991px) {
      flex-wrap: wrap;
      margin: 0 0 40px 0 !important;

      &:last-child {
        margin: 0 !important;
      }

      .img {
        width: 150px !important;
        height: 150px !important;
        margin: 0 0 20px 0 !important;

        &:after {
          width: 150px !important;
          height: 150px !important;
        }
      }

      .about {
        width: 100%;

        h2 {
          font-size: 20px !important;
        }

        h4 {
          font-size: 18px !important;
          margin: 0 0 10px 20px !important;
        }
      }
    }
  }
</style>

<docs>
  ```jsx```
</docs>