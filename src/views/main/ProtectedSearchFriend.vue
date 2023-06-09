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
        <b-dropdown
            text="Filtruj"
            block
            variant="primary"
            class="m-2"
            menu-class="w-100"
        >
          <b-container>
            <b-row>
              <b-col lg="6" class="my-1">
                <b-form-group
                    label="Sortuj"
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
                        <option value="">-- brak --</option>
                      </template>
                    </b-form-select>

                    <b-form-select
                        v-model="sortDesc"
                        :disabled="!sortBy"
                        :aria-describedby="ariaDescribedby"
                        size="sm"
                        class="w-25"
                    >
                      <option :value="false">Rosnąco</option>
                      <option :value="true">Malejąco</option>
                    </b-form-select>
                  </b-input-group>
                </b-form-group>
              </b-col>


              <b-col lg="6" class="my-1">
                <b-form-group
                    label="Szukaj"
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
                        placeholder="Wpisz, aby wyszukać"
                        :disabled="isFilterInputDisabled"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Czyść</b-button>
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


            </b-row>
          </b-container>
        </b-dropdown>
        <b-col sm="5" md="6" class="my-1">
          <b-form-group
              label="Na stronę"
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
            <router-link class="messages-btn" :to="{ name: 'protected-mail-conversations', params: {id:row.item.id, friendFirstName: row.item.firstName, friendLastName:row.item.lastName}}" tag="b-button">Wiadomość</router-link>
            <b-button variant="primary" size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
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
        <b-modal :id="infoModal.id" :title="infoModal.title" @hide="resetInfoModal">
          <ModalPersonDetails :person-data="infoModal.content"/>
          <template #modal-footer>
            <div class="w-100">
              <router-link :to="{ name: 'user', params: { id: infoModal.content.id }}" tag="b-button" class="float-left">Pokaż profil</router-link>
            </div>
          </template>
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
      fields: [
        { key: 'firstName', label: 'Imię', sortable: true, sortDirection: 'desc' },
        { key: 'lastName', label: 'Nazwisko', sortable: true, sortDirection: 'desc' },
        { key: 'description', label: 'Opis' },
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
        { key: 'actions', label: '' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Pokaż wiele" }],
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
      this.infoModal.content = JSON.parse(JSON.stringify(item, null, 2))
      this.infoModal.title = this.infoModal.content.firstName + ' ' + this.infoModal.content.lastName
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

<style scoped>
.messages-btn {
  background-color: #5d5d5d;
}
</style>