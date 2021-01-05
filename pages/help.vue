<template>
  <div class="wrapper">
    <div class="container">
      <section>
        <h2>About myBloomington</h2>

        <p><strong>myBloomington</strong> is a service offered by the <strong>City of Bloomington, Indiana ITS Department</strong> to find local information related to a street address. The information reported comes from the City of Bloomington’s Master Address Database, Geographic Information Systems (GIS) and other related databases unless otherwise noted below. City staff strives to keep complete and accurate information and regrets any errors or omissions. <a href="https://bloomington.in.gov/web" target="_blank">(Data Disclaimer)</a></p>

        <p>The address database includes street addresses within the City of Bloomington and City of Bloomington Utilities customers outside the city limits. The address database contains many Monroe County addresses outside these two areas, but not all. See the address search tips section below for help with address search entries.</p>

        <p>Road Closing information pertains to public streets within the City Limits. For more information on Road Closings, see the Roads & Traffic section of the City website or contact the Public Works Department at 812.349.3411.</p>

        <p>Voting Precinct information comes from the Monroe County Clerk's Office. For questions regarding voting precinct information, please contact the Monroe County Voter Registration office at 812-349-2690.</p>

        <p>Nearby Fire Hydrant information comes from the City of Bloomington Utilities GIS. Hydrants maintained by other agencies or private individuals may not show up in this report. For questions regarding fire hydrants, please contact the City of Bloomington Utilities Department at 812.349-3930.</p>

        <p>Report a problem with an address within the City limits or other issues with <a href="https://bloomington.in.gov/ureport/miscellaneous/53" target="_blank">uReport</a>.</p>
      </section>

      <section>
        <h2>Search Tips</h2>

        <p><strong>The standard primary street address includes (with example):</strong></p>

        <ul>
          <li>Street Number (401)</li>
          <li>Pre Directional (N)</li>
          <li>Street Name (Morton)</li>
          <li>Street Name Type Suffix (Street)</li>
        </ul>

        <p>It is not necessary to enter an apartment or suite number.</p>

        <p>Do not enter the postal community, state or zip code.</p>

        <p>The address search is not case sensitive, that is you can use upper or lowercase when entering text. For example, 401 n morton street works as well as 401 N Morton Street or 401 N MORTON STREET.</p>

        <p>You may abbreviate the street direction using the first letter of the direction, such as n for north. (401 N Morton Street) If you are unsure of the street direction, you may leave it off. (401 Morton Street) If there is more than one match, you will be provided with a list of address choices.</p>

        <p>You may abbreviate the street type suffix with a postal standard abbreviation. If you are unsure of the correct suffix or not finding the address you are searching for, try leaving it off. (401 N Morton) If there is more than one match, you will be provided with a list of address choices.</p>

        <p>The numbered streets in Bloomington are entered as numbers and not spelled out. These include 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th, 13th, 14th, 15th, 16th, 17th, 18th, 19th, 20th.</p>

        <p>Enter state road addresses in the form of street number, street direction State Road, and state road number. For example, 4125 E State Road 45. The correct street name form for addresses on the Bypass is State Road 45 46 Bypass. Addresses on the Bypass that are south of E 10th Street/E State Road 45, are N or S State Road 46 addresses.</p>

        <p>There are a few Bloomington streets  that also includes a post direction after the street name type suffix.</p>

        <p><strong>These include:</strong></p>
        <ul>
          <li>E Bayberry Court E and E Bayberry Court W</li>
          <li>N Glenwood Avenue E and N Glenwood Ave W</li>
          <li>E Longwood Court E and E Longwood Court W</li>
          <li>N Ramble Road E and N Ramble Road W</li>
          <li>S Westminster Way W</li>
        </ul>
      </section>

      <section>
        <h2>Don't Find Your Address?</h2>

        <p>Report a problem with an address within the City limits or other issues with <a href="https://bloomington.in.gov/ureport/miscellaneous/53" target="_blank">uReport</a>.</p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  layout:           'help',
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  top: 100px;
  padding: 50px 0 0 0;

  h1, h2, h3, h4, p, ul {
  margin: 0 0 20px 0;
}

p {
  font-size: 18px;
}

ul {
  margin: 0 0 20px 40px;
  list-style-type: disc;

  li {
    color: $text-color;
  }
}
}



@media (max-width: 575px) {
  .wrapper {
    padding: 20px 0 0 0;

    .container {
      padding: 0 20px;

      section {
        margin: 0;
      }
    }
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .wrapper {
    padding: 20px 0 0 0;

    .container {
      padding: 0 20px;

      section {
        margin: 0;
      }
    }
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .wrapper {
    padding: 20px 0 0 0;

    .container {
      padding: 0 20px;

      section {
        margin: 0;
      }
    }
  }
}
</style>