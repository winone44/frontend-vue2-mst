<template>
  <transition name="fade" mode="out-in">
    <div v-if="isLoading" class="padding-y">
      <h4>Wczytywanie użytkowników</h4>
      <div class="text-center">
        <b-spinner variant="primary"/>
      </div>
    </div>
    <div v-else>
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col lg="6" class="my-1">
            <b-form-group
                label="Sort"
                label-for="sort-by-select"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
                v-slot="{ ariaDescribedby }"
            >
              <b-input-group size="sm">
                <b-form-select
                    id="sort-by-select"
                    v-model="sortBy"
                    :options="sortOptions"
                    :aria-describedby="ariaDescribedby"
                    class="w-75"
                >
                  <template #first>
                    <option value="">-- none --</option>
                  </template>
                </b-form-select>

                <b-form-select
                    v-model="sortDesc"
                    :disabled="!sortBy"
                    :aria-describedby="ariaDescribedby"
                    size="sm"
                    class="w-25"
                >
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
                label="Initial sort"
                label-for="initial-sort-select"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
            >
              <b-form-select
                  id="initial-sort-select"
                  v-model="sortDirection"
                  :options="['asc', 'desc', 'last']"
                  size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Type to Search"
                    :disabled="isFilterInputDisabled"
                ></b-form-input>

                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
                v-model="sortDirection"
                label="Filter On"
                description="Pozostaw wszystkie niezaznaczone, aby filtrować na wszystkich danych."
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
                v-slot="{ ariaDescribedby }"
            >
              <b-form-checkbox-group
                  v-model="filterOn"
                  :aria-describedby="ariaDescribedby"
                  class="mt-1"
              >
                <b-form-checkbox value="lastName">Nazwisko</b-form-checkbox>
                <b-form-checkbox value="age">Wiek</b-form-checkbox>
                <b-form-checkbox value="is_company">Przedsiebiorca</b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
          </b-col>

          <b-col sm="5" md="6" class="my-1">
            <b-form-group
                label="Per page"
                label-for="per-page-select"
                label-cols-sm="6"
                label-cols-md="4"
                label-cols-lg="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
            >
              <b-form-select
                  id="per-page-select"
                  v-model="perPage"
                  :options="pageOptions"
                  size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col sm="7" md="6" class="my-1">
            <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table
            :items="people"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            stacked="md"
            show-empty
            small
            @filtered="onFiltered"
        >
          <template #cell(name)="row">
            {{ row.value }}
          </template>

          <template #cell(actions)="row">
            <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
              Więcej informacji
            </b-button>
            <b-button v-if="!friend.some((obj) => obj.friend.id === row.item.id)" size="sm" variant="success" @click="addFriend(row.item.id)">
              Dodaj znajomego
            </b-button>
            <b-button v-else size="sm" variant="danger" @click="delFriend(row.item.id)">
              Usuń znajomego
            </b-button>
          </template>

          <template #row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>
            </b-card>
          </template>
        </b-table>

        <!-- Info modal -->
        <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
          <ModalPersonDetails :person-data="infoModal.content"/>
        </b-modal>
      </b-container>
    </div>
  </transition>
</template>

<script>
import ModalPersonDetails from "@/components/ModalPersonDetails";
export default {
  components: {ModalPersonDetails},
  data() {
    return {
      // items: [
      //   { age: 40, firstName: 'Dickerson', lastName: 'Macdonald' },
      //   { age: 21, firstName: 'Larsen', lastName: 'Shaw' },
      //   { age: 89, firstName: 'Geneva', lastName: 'Wilson' },
      //   { age: 38, firstName: 'Jami', lastName: 'Carney' },
      //   { age: 27, firstName: 'Essie', lastName: 'Dunlap' },
      //   { age: 40, firstName: 'Thor', lastName: 'Macdonald' },
      //   { age: 26, firstName: 'Mitzi', lastName: 'Navarro' },
      //   { age: 22, firstName: 'Genevieve', lastName: 'Wilson' },
      //   { age: 38, firstName: 'John', lastName: 'Carney' },
      //   { age: 29, firstName: 'Dick', lastName: 'Dunlap' }
      // ],
      fields: [
        { key: 'firstName', label: 'Imię', sortable: true, sortDirection: 'desc' },
        { key: 'lastName', label: 'Nazwisko', sortable: true, sortDirection: 'desc' },
        { key: 'age', label: 'Wiek', sortable: true, class: 'text-center' },
        {
          key: 'is_company',
          label: 'Przedsiembiorstwo',
          formatter: (value) => {
            return value ? 'Tak' : 'Nie'
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true
        },
        { key: 'actions', label: 'Actions' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      isLoading: true,
      isFilterInputDisabled: false,
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
    },
    people() {
      console.log(this.$store.state.people)
      return this.$store.state.people;
    },
    friend() {
      console.log(this.$store.state.friends)
      return this.$store.state.friends;
    }
  },
  async created() {
    await this.$store.dispatch('getPeople');
    await this.$store.dispatch('getFriends');
    this.isLoading = false;
  },
  watch: {
    people() {
      this.totalRows = this.people.length
    },
    filterOn(next) {
      if (next.includes('is_company')) {
        this.filter = 'Tak'
        this.isFilterInputDisabled = true
      }
      else {
        this.filter = ''
        this.isFilterInputDisabled = false
      }
    }
  },
  methods: {
    async addFriend(id) {
      await this.$store.dispatch('addFriend', {
        person: this.$store.state.userId,
        friend: id
      })
      await this.$store.dispatch('getFriends');
    },
    async delFriend(id) {
      await this.$store.dispatch('delFriend', {
        person: this.$store.state.userId,
        friend: id
      })
      await this.$store.dispatch('getFriends');
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.parse(JSON.stringify(item, null, 2))
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  }
}
</script>