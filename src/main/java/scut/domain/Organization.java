package scut.domain;

import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Organization {
    public interface WithIdAndName {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "superior_organization",
            joinColumns = @JoinColumn(
                    name = "superior_organization_id",
                    referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_superior_organization_superior_organization_id")),
            inverseJoinColumns = @JoinColumn(
                    name = "organization_id",
                    referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_superior_organization_organization_id")))
//    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<Organization> directInferiorOrganizations;

    @Transient
    private Set<Organization> allInferiorOrganizations;

    public Organization() {
        allInferiorOrganizations = new HashSet<>();
    }

    @JsonView(WithIdAndName.class)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @JsonView(WithIdAndName.class)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Organization> getAllInferiorOrganizations() {
        return allInferiorOrganizations;
    }

    public void setAllInferiorOrganizations(Set<Organization> allInferiorOrganizations) {
        this.allInferiorOrganizations = allInferiorOrganizations;
    }

    public Set<Organization> getDirectInferiorOrganizations() {
        return directInferiorOrganizations;
    }

    public void setDirectInferiorOrganizations(Set<Organization> directInferiorOrganizations) {
        this.directInferiorOrganizations = directInferiorOrganizations;
    }

    private void fetchAllInferiorOrganizations(Set<Organization> result, Organization currentOrganization) {
        for (Organization o : currentOrganization.getDirectInferiorOrganizations()) {
            result.add(o);
            fetchAllInferiorOrganizations(result, o);
        }
    }

    public void fetchAllInferiorOrganizations() {
        fetchAllInferiorOrganizations(allInferiorOrganizations, this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Organization that = (Organization) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Organization{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
