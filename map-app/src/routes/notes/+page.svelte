<script>
    import { Container, Row, Col, ListGroup, ListGroupItem } from "@sveltestrap/sveltestrap";
</script>

<Container class="mt-2">
    <Row>
        <Col md="8">
            <h1 class="display-4">Data Notes & Caveats</h1>
            <p
                class="lead"
                style="font-weight: 450; font-size:1rem; margin-bottom: .6rem;"
            >
                <a href="./..">Back to map</a>
            </p>
            <p class="lead">
                Some of these caveats are here to stay; some will go away as I gradually work through further cleaning the data. I will update this page through the process.
            </p>
            <p class='lead'>Last updated: August 12, 2024</p>
            
            <ul>
                <li>The phrasing of some 2024 event names may not match that of other years. This also affects the total counts for "All years (1896-2024)." I am actively working on going through these.</li>
                <li>I have used basemaps from 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994 and 2000. Any changes in borders or country names between these dates or after 2000 will not be accurately reflected on the map.</li>
                <li>There is a known issue with Switzerland. It does not behave as expected on the map from 1994-2024. Its counts in the table view should be accurate.</li>
                <li>Russia's counts presently include those which were competed for under the names: Russian Federation, Russian Empire and Soviet Union. At this time, the following Russia-affiliated teams have not been included in this data: Unified Team (1992), Olympic Athletes from Russia (2018), ROC (2020-2022), Individual Neutral Athletes (2024). I plan to give this more attention and consideration at a later date.</li>
                <li>Lithuania does not appear on the map from 1960-1994. Its total medal counts are accurate.</li>
                <li>The Australasia Team, which participated in 1908 and 1912, is missing from the map. It does appear in the table view.</li>
                <li>Bohemia, which competed in 1900, 1908 and 1912, is not being counted anywhere on the map. It does appear on the table.</li>
                <li>Finland first competed in 1908, but it does not appear on the map until 1914, as it appears on the earlier base maps as part of the Russian Empire.</li>
                <li>From 1896-1912, Austria and Hungary appear as one feature on the map, but sources usually separate out these wins. For now, all wins are attributed to Austria (random choice for simplicity), including in the All years (1896-2024) counts. Eventually I will separate these for the total.</li>
                <li>From 1900-1912, there is one Sweden Norway feature on the map. All medals from that time count for Norway in totals (random choice for simplicity). I will separate these out at a later date.</li>
                <li>The first Olympic year Ireland appears on the map as its own feature is 1948, though Ireland competed earlier. Before 1948, Ireland is grouped with Great Britain, and all wins count toward Great Britain's total. I will separate these out at a later date.</li>
                <li>From 1945-1956, Germany is spliton the map as Germany (USA) and Germany (Soviet). For now I have set both to count toward Germany's total, but I will check later if Germany (Soviet) should count toward Russia's totals in the All years view.</li>
                <li>Liechtenstein does not show up on the map from 1960-1992. Medals are still counted toward its total counts.</li>
                <li>Medals won by 'Serbia and Montenegro' do not appear on the map but do appear under this name on the table. The countries competed separately post-2000.</li>
                <li>Medal counts for Bahrain, Bermuda, Kosovo, Mauritius, Netherlands Antilles, Singapore, West Indies Federation and United States Virgin Islands do not display on the map. They <em>can</em> be viewed via the table view.</li>              
            </ul>
            <p
            class="lead"
            style="font-weight: 450; font-size:1rem; margin-bottom: .6rem;"
        >
            <a href="./..">Back to map</a>
        </p>
        </Col>
    </Row>
</Container>
