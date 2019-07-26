import Vue          from 'vue'
import axios        from 'axios'
import {
  mapFields }       from 'vuex-map-fields'

Vue.mixin({
  data() {
    return {
    }
  },
  computed: {
    ...mapFields([
      'consoleLog',
    ])
  },
  methods: {
    /**
     * A promise returning City Council
     * district seats (members).
     *
     * @promise     getCityCouncil
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> }
     */
    getCityCouncil() {
      return new Promise((resolve, reject) => {
        axios.get(`https://bloomington.in.gov/onboard/committees/members?committee_id=1&format=json`)
        .then((res) => resolve(res.data.seats))
        .catch(e    => reject(e))
      })
    },
    /**
     * A Promise returning a Directory User via
     * username.
     *
     * @promise     getDirectoryUser
     * @param       { String } username
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> }
     */
    getDirectoryUser(username){
      return new Promise((resolve, reject) => {
        axios.get(`https://bloomington.in.gov/directory/people/view?format=json&username=${username}`)
        .then(res => resolve(res.data))
        .catch(e  => reject(e))
      })
    },
    /**
     * A promise returning a Location result
     * via an Address ID.
     *
     * @promise   getLocation
     * @param     { Integer } id
     * @resolve   { Object }
     * @reject    { Error }
     * @return    { Promise <Object> }
     */
    getLocation(id) {
      return new Promise((resolve, reject) => {
        axios.get(`https://bloomington.in.gov/master_address/addresses/${id}?format=json`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    /**
     * A promise returning an Address result
     * via an Address String.
     *
     * @promise   getAddress
     * @param     { String } address
     * @resolve   { Object }
     * @reject    { Error }
     * @return    { Promise <Object> }
     */
    getAddress(address) {
      return new Promise((resolve, reject) => {
        let regExTest = /\d+\s+\w+/,
            addressTest = regExTest.test(address);

        console.dir(addressTest);

        if(addressTest) {
          axios.get(`https://bloomington.in.gov/master_address/addresses?format=json&address=${address}`)
          .then((res) => {
            console.dir();
            if(res.data.length == 1) {
              resolve(res.data[0])
            } else if(res.data.length <= 20) {
              resolve(res.data)
              console.dir(`getAddress() Search Result Count: ${res.data.length}`);
            } else {
              reject(`We didn't find an Address for '${address}'.`)
              console.dir(`getAddress() Search Result Count: ${res.data.length}`);
              console.table(JSON.stringify(res.data));
            }
          })
          .catch((e)  => reject(e))
        } else {
          reject('Please refine your Address Search.')
        }
      })
      // axios.get(`https://bloomington.in.gov/master_address/addresses?format=json&address=${address}`)
      // .then((res) => {
      //   if(res.data.length > 1) {
      //     alert('pick one!!')
      //   } else {
      //     axios.get(`https://bloomington.in.gov/master_address/addresses/${res.data[0].id}?format=json`)
      //     .then((res) => {
      //       this.addressResData = res.data;
      //     })
      //     .catch((e)  => {
      //       console.log(`%c addressLocation 🛑 `,
      //                   this.consoleLog.error,
      //                   `\n\n ${e} \n\n`);
      //     })
      //   }
      // })
      // .catch((e)  => {
      //   console.log(`%c addressSearch 🛑 `,
      //               this.consoleLog.error,
      //               `\n\n ${e} \n\n`);
      // })
    }
  }
})