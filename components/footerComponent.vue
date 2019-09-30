<template>
  <footer>
    <div class="container">
      <div>
        <a :href="baseUrl" :title="cityName">
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" enable-background="new 0 0 150 150" xml:space="preserve">
            <path fill="currentColor" d="M31.9991798 21.9479866l-9.2252731-9.1214876v9.9777803h-9.9542208l8.546052 9.7757187-8.546052 8.5448837h28.3022128V12.826499zM21.9450626 117.9943542l-9.1214666 9.2252961h9.9777575v9.9542389l9.7756958-8.5460663 8.5448684 8.5460663v-28.302269H12.823596zM128.0453339 32.0021477l9.1214599-9.225296h-9.9777527V12.822608l-9.7756958 8.546071-8.5448684-8.546071v28.3022737h28.2983169zM117.9912109 128.0485077l9.2252732 9.1214905v-9.9777756h9.954216l-8.5460511-9.7757187 8.5460511-8.5448837h-28.3022003v28.298378zM56.9043694 60.8636856L42.7692757 46.7080574H14.4699984l13.8836069 14.3220062H0l14.4675837 13.9730416L0 89.594017h28.3536053l-13.8860216 13.6926346 28.3063535.0017929 14.1296387-14.1569443-14.1311646-14.1354751zM93.0956268 89.1328201l14.1351013 14.1556244h28.2992707l-13.883606-14.3220062H150l-14.4675903-13.9730377L150 60.4024849h-28.3536072l13.8860169-13.6926308-28.3063507-.0017967-14.1296387 14.1569481 14.1311722 14.1354752zM89.1297226 56.9044991l14.1555939-14.1351243V14.4700317L88.9633408 28.3536701V0L74.9903336 14.467617 60.399456 0v28.3536701L46.7068558 14.467617l-.0017967 28.3064194 14.1569137 14.1296692 14.1354408-14.1311989zM60.860672 93.0954971L46.7050781 107.230629v28.2993393L61.02705 121.6463318V150l13.973011-14.4676208L89.5909348 150v-28.3536682l13.692604 13.8860474.0018006-28.3064118L89.128418 93.0962906l-14.1354447 14.1312027z"/>
          </svg>
        </a>
      </div>

      <div>
        <p>The <strong>City of Bloomington</strong> staff strives to keep complete and accurate information and regrets any errors or omissions.</p>

        <p>The information reported comes from the <strong>City of Bloomington Geographic Information Systems (GIS)</strong> and other related databases.</p>

        <p>To report missing <strong>City of Bloomington</strong> addresses or other errors, please contact the <strong>City of Bloomington GIS Staff</strong> at <a class="external" target="_blank" href="mailto: gis@bloomington.in.gov">gis@bloomington.in.gov</a>.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
footer {
  border-top: 1px solid $color-grey;
  background-color: lighten($color-grey-lighter, 2%);
  margin: 60px 0 0 0;
  padding: 0 20px;

  .container {
    display: flex;
    align-items: top;
    padding: 60px 0;

    div {
      &:first-of-type {
        margin: 0 60px 0 0;

        a {
          svg {
            path {
              fill: $text-color;
            }
          }

          &:hover {
            svg {
              path {
                fill: $color-blue;
              }
            }
          }
        }

        svg {
          width: 125px;
          height: 125px;
        }
      }
    }
  }

  p {
    color: $text-color;
    margin: 0 0 20px 0;
  }

  @media (max-width: 575px) {
    margin: 20px 0 0 0;

    .container {
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      padding: 20px;

      div {
        &:first-of-type {
          margin: 0 0 20px 0;
        }
      }
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    margin: 20px 0 0 0;

    .container {
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      padding: 20px;

      div {
        &:first-of-type {
          margin: 0 0 20px 0;
        }
      }
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    margin: 20px 0 0 0;

    .container {
      width: 100%;
      padding: 20px;
    }
  }
}
</style>